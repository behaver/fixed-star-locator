# FixedStarCoordinate
[![GitHub license](https://img.shields.io/badge/license-ISC-brightgreen.svg)](#) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/@behaver/fixed-star-coordinate) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

## 简介

FixedStarCoordinate 是一个用于计算恒星赤道坐标的天文组件，计算的结果最终将以 `EquinoctialCoordinate` 实例返回。

## 安装

通过 npm 安装，在你的 node 项目目录下执行：

`npm install @behaver/fixed-star-coordinate`

安装完成后，调用即可：

`const FixedStarCoordinate = require('@behaver/fixed-star-coordinate');`

## 用例

```js
const { JDateRepository } = require('@behaver/jdate');
const FixedStarCoordinate = require('@behaver/fixed-star-coordinate');

// 实例化儒略时间对象
let jdate = new JDateRepository(2462088.69, 'jde');

// 实例化恒星赤道坐标计算组件
let FSC = new FixedStarCoordinate(jdate);

// 获取赤道坐标组件
let eqc = FSC.get({
  RA: 41.0500,
  Dec: 49.2283,
  PMRA: 0.336,
  PMDec: -0.089,
  radVel: 25,
  parallax: 0.089,
});

// 输出赤经，单位：°
console.log(eqc.ra.getDegrees());

// 输出赤纬，单位：°
console.log(eqc.dec.getDegrees());

// 输出赤地心距，单位：AU
console.log(eqc.radius);
```

## API

`constructor(epoch, model)`

构造函数

* epoch 目标历元
* model 计算模型：'dyn': 动力学; 'tri': 三角学;

`get(options)`

获取恒星赤道坐标对象

* options.RA       J2000 平赤经，单位：°
* options.Dec      J2000 平赤纬，单位：°
* options.parallax 周年视差，单位：角秒
* options.PMRA     赤经自行，单位：角秒每儒略年
* options.PMDec    赤纬自行，单位：角秒每儒略年
* options.radVel   日心视向速度，单位：km/s

`set epoch(value)`

设置目标历元对象

`get epoch()`

获取目标历元对象

`set model(value)`

设置计算模型

`get model()`

获取计算模型缩写字串

## 许可证书

The ISC license.