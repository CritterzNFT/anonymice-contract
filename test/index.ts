import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import { ethers } from "hardhat";
import traitTypes from "../data/trait_types.json";
import { Anonymice } from "../typechain";

const setup = async () => {
  const Anonymice = await ethers.getContractFactory("Anonymice");
  const contract = await Anonymice.deploy();
  await contract.deployed();
  for (let { _traitTypeIndex, traits } of traitTypes) {
    await contract.addTraitType(_traitTypeIndex, traits);
  }
  return contract;
};

const mintN = async (contract: Anonymice, n: number) => {
  for (let i = 0; i < n; i++) {
    console.log(i);
    await contract.mintMouse();
  }
};

describe("AddTraitType", () => {
  it("Trait types should match added trait types.", async function () {
    const contract = await setup();
    for (let i in traitTypes) {
      for (let j in traitTypes[i].traits) {
        const {
          traitName,
          traitType,
          pixels,
          pixelCount: pixelCountInt,
        } = traitTypes[i].traits[j];
        const pixelCount = BigNumber.from(pixelCountInt);
        expect(await contract.traitTypes(i, j)).to.deep.equal([
          traitName,
          traitType,
          pixels,
          pixelCount,
        ]);
      }
    }
  });
});

describe("mintMouse", () => {
  it("Should mint a mouse.", async function () {
    const contract = await setup();
    await mintN(contract, 1);
    expect(await contract.totalSupply()).to.equal(1);
    await mintN(contract, 35);
    expect(await contract.totalSupply()).to.equal(36);
  });
});

describe("currentCheethCost", () => {
  it("Should return the correct cost", async () => {
    const contract = await setup();
    expect(await contract.currentCheethCost(), "incorrect cost for 0").to.equal(
      BigNumber.from(0)
    );
  });
});
