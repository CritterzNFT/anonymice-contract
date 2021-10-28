// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import traitTypes from "../data/trait_types.json";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Anonymice = await ethers.getContractFactory("Anonymice");
  const anonymiceContract = await Anonymice.deploy();

  await anonymiceContract.deployed();

  console.log("anonymice contract deployed to:", anonymiceContract.address);

  const Cheeth = await ethers.getContractFactory("Cheeth");
  const cheethContract = await Cheeth.deploy();

  await cheethContract.deployed();

  console.log("cheeth contract deployed to:", cheethContract.address);

  await anonymiceContract.setCheethAddress(cheethContract.address);

  console.log("anonymice cheeth address set");

  await cheethContract.setAnonymiceAddress(anonymiceContract.address);

  console.log("cheeth anonymice address set");

  for (let { _traitTypeIndex, traits } of traitTypes) {
    await anonymiceContract.addTraitType(_traitTypeIndex, traits);
    console.log(
      "anonymice trait types added:",
      _traitTypeIndex,
      traits[0].traitType,
      traits.map((t) => t.traitName)
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
