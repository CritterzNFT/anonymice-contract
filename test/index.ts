import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import { ethers } from "hardhat";
import traitTypes from "../data/trait_types.json";

async function setup() {
  const Anonymice = await ethers.getContractFactory("Anonymice");
  const contract = await Anonymice.deploy();
  await contract.deployed();
  for (let { _traitTypeIndex, traits } of traitTypes) {
    await contract.addTraitType(_traitTypeIndex, traits);
  }
  return contract;
}

describe("AddTraitType", function () {
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
