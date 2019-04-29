'use strict';

const { EquinoctialCoordinate } = require('@behaver/celestial-coordinate');
const { DynamicCalculator, TrigonometricCalculator } = require('@behaver/fixed-star-calculator');
const { JDateRepository } = require('@behaver/jdate');

/**
 * FixedStarPosition
 *
 * FixedStarPosition 是一个用于计算恒星坐标的组件
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class FixedStarPosition {

  /**
   * 构造函数
   * 
   * @param {JDateRepository} epoch 目标历元
   * @param {String}          model 计算模型：'dyn': 动力学, 'tri': 三角学
   */
  constructor(epoch, model = 'dyn') {
    
    // 初始化私有空间
    this.private = {}

    this.private.epoch = epoch;
    this.model = model;
  }

  /**
   * 获取恒星赤道坐标对象
   * 
   * @param  {Number}                options.RA       J2000 平赤经，单位：°
   * @param  {Number}                options.Dec      J2000 平赤纬，单位：°
   * @param  {Number}                options.parallax 周年视差，单位：角秒
   * @param  {Number}                options.PMRA     赤经自行，单位：角秒每儒略年
   * @param  {Number}                options.PMDec    赤纬自行，单位：角秒每儒略年
   * @param  {Number}                options.radVel   日心视向速度，单位：km/s
   * @return {EquinoctialCoordinate}                  恒星赤道坐标对象
   */
  get({
    RA,
    Dec,
    parallax,
    PMRA,
    PMDec,
    radVel,
  }) {
    // 计算获取恒星赤道球坐标，结果修正了自行与周年视差
    let sc = this.Calculator.calc({
      RA,
      Dec,
      parallax,
      PMRA,
      PMDec,
      radVel,
    });

    // 实例化赤道坐标对象
    let EQC = new EquinoctialCoordinate({
      sc,
    });

    // 修正岁差, 光行差, 章动
    EQC.on({
      epoch: this.epoch,
      withAnnualAberration: true,
      withNutation: true,
    })

    return EQC;
  }

  /**
   * 设置目标历元对象
   * 
   * @param {JDateRepository} value 目标历元对象
   */
  set epoch(value) {
    if (!(value instanceof JDateRepository)) throw Error('The param value should be a instance of JDateRepository');
    
    this.Calculator.epoch = value;
    this.private.epoch = value;
  }

  /**
   * 获取目标历元对象
   * 
   * @return {JDateRepository} 目标历元对象
   */
  get epoch() {
    return new JDateRepository(this.private.epoch.JD);
  }

  /**
   * 设置计算模型
   * 
   * @param {String} value 计算模型缩写字串
   *                       dyn: 动力学模型, tri: 三角学模型
   */
  set model(value) {
    // 参数检验
    if (typeof(value) !== 'string') throw Error('The param value should be a String.');
    
    value = value.toLowerCase();

    if (value === 'dyn') {
      if (this.private.model !== 'dyn') {
        this.Calculator = new DynamicCalculator(this.private.epoch);
        this.private.model = 'dyn';
      }
    } else if (value === 'tri') {
      if (this.private.model !== 'tri') {
        this.Calculator = new TrigonometricCalculator(this.private.epoch);
        this.private.model = 'tri';
      }
    } else {
      throw Error('The param value should be valid.');
    }
  }

  /**
   * 获取计算模型缩写字串
   * 
   * @return {String} 计算模型缩写字串
   */
  get model() {
    return this.private.model;
  }
}

module.exports = FixedStarPosition;
