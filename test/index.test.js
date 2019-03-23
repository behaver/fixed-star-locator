'use strict';

const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { EquinoctialCoordinate } = require('@behaver/celestial-coordinate');
const { DynamicCalculator, TrigonometricCalculator } = require('@behaver/fixed-star-calculator');
const FixedStarCoordinate = require('../index');

describe('#index', () => {
  describe('#constructor(epoch, model)', () => {
    it('The param epoch should be an instance of JDateRepository.', () => {
      expect(() => {
        new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
      }).not.to.throw();

      expect(() => {
        new FixedStarCoordinate('123');
      }).to.throw();
    });

    it('The param model should be a valid string.', () => {
      expect(() => {
        new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'), 'tri');
      }).not.to.throw();

      expect(() => {
        new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'), 123);
      }).to.throw();

      expect(() => {
        new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'), '123');
      }).to.throw();
    });
  });

  describe('#set epoch(value)', () => {
    it('The param value should be an instance of JDateRepository.', () => {
      expect(() => {
        let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
        FSC.epoch = new JDateRepository(2362088.69, 'jde');
      }).not.to.throw();

      expect(() => {
        let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
        FSC.epoch = '123';
      }).to.throw();
    });

    it('After setting, the related props should be auto changed too.', () => {
      let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
      FSC.epoch = new JDateRepository(2362088.69, 'jde');

      expect(FSC.private.epoch.JDE).to.equal(2362088.69);
      expect(FSC.Calculator.epoch.JDE).to.equal(2362088.69);
    });
  });

  describe('#get epoch()', () => {
    it('The return of this method should be an instance of JDateRepository.', () => {
      let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));

      expect(FSC.epoch).to.be.an.instanceof(JDateRepository);
    });
  });

  describe('#set model(value)', () => {
    it('The param value should be a valid String.', () => {
      expect(() => {
        let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
        FSC.model = 'tri';
      }).not.to.throw();

      expect(() => {
        let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
        FSC.model = 'abc';
      }).to.throw();
    });

    it('After setting, the related props should be auto changed too.', () => {
      let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
      FSC.model = 'tri';
      
      expect(FSC.private.model).to.equal('tri');
      expect(FSC.Calculator).to.be.an.instanceof(TrigonometricCalculator);
    });
  });

  describe('#get model()', () => {
    it('The return of method should be a String.', () => {
      let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));

      expect(FSC.model).to.equal('dyn');
    });
  });

  describe('#get(options)', () => {
    it('The param options should be all number and existed.', () => {
      expect(() => {
        let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
        FSC.get({
          RA: 41.0500,
          Dec: 49.2283,
          PMRA: 0.336,
          PMDec: -0.089,
          radVel: 25,
          parallax: 0.089,
        });
      }).not.to.throw();

      expect(() => { // 缺值
        let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
        FSC.get({
          RA: 41.0500,
          Dec: 49.2283,
          PMRA: 0.336,
          PMDec: -0.089,
          radVel: 25,
        });
      }).to.throw();

      expect(() => { // 错值
        let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
        FSC.get({
          RA: '41.0500',
          Dec: 49.2283,
          PMRA: 0.336,
          PMDec: -0.089,
          radVel: 25,
          parallax: 0.089,
        });
      }).to.throw();
    });

    it('The return of method should be an EquinoctialCoordinate.', () => {
      let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
      let eqc = FSC.get({
        RA: 41.0500,
        Dec: 49.2283,
        PMRA: 0.336,
        PMDec: -0.089,
        radVel: 25,
        parallax: 0.089,
      });

      expect(eqc).to.be.an.instanceof(EquinoctialCoordinate);
    });

    it('Verify', () => {
      let FSC = new FixedStarCoordinate(new JDateRepository(2462088.69, 'jde'));
      let eqc = FSC.get({
        RA: 41.0500,
        Dec: 49.2283,
        PMRA: 0.336,
        PMDec: -0.089,
        radVel: 25,
        parallax: 0.089,
      });

      expect(eqc.ra.getDegrees()).to.closeTo(41.5599646, 0.002);
      expect(eqc.dec.getDegrees()).to.closeTo(49.3520685, 0.0002);
    });
  });
})