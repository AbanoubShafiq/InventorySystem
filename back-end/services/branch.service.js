const repo = require('../repos/branch.repo');

module.exports.getAllBranches =async () => 
{
    try{
        const branches = await repo.getBranches();
        return branches;
    }catch (error)
    {
        throw new Error("Error getting branches: " + error.message);
    }
}

module.exports.getBranchById =async (branchId) => 
{
    try{
        const branch = await repo.getBranchById(branchId);
        return branch;
    }catch (error)
    { 
        throw new Error("Error getting branch: " + error.message);
    }
}

module.exports.getBranchesByActive =async () => 
{
    try{
        const Branches = await repo.getBranchesByActive();
        return Branches;
    }catch (error)
    { 
        throw new Error("Error getting active branches: " + error.message);
    }
}
module.exports.getBranchesByType =async (branchType) => 
{
    try{
        const Branches = await repo.getBranchesByType(branchType);
        return Branches;
    }catch (error)
    { 
        throw new Error("Error getting branches " + error.message);
    }
}

module.exports.getBranchByName =async (branchName) => 
{
    try{
        const branch = await repo.getBranchByName(branchName);
        return branch;
    }catch (error)
    { 
        throw new Error("Error getting branch: " + error.message);
    }
}
module.exports.addBranch=async (data) => 
{
    try{
        const savedBranch = await repo.addBranch(data);
        return savedBranch;
    }catch (error)
    { 
        throw new Error("Error adding branch: " + error.message);
    }
}

module.exports.updateBranch = async (branchId, data) => {
    try {
      const updatedBranch = await repo.updateBranch(branchId, data);
      
      if (!updatedBranch) {
        throw new Error("Branch not found");
      }
      return updatedBranch;
    } catch (error) {
      throw new Error("Error updating branch: " + error.message);
    }
}

module.exports.updateBranchActive = async (branchId) => {
    try {
        const updatedBranch = await repo.updateBranchActive(branchId);

        if (!updatedBranch) {
            throw new Error("Branch not found");
        }
        return updatedBranch;
    } catch (error) {
        throw new Error("Error updating branch: " + error.message);
    }
}

  module.exports.deleteBranch= async (branchId) => {
    try {
      const deletedBranch = await repo.deleteBranch(branchId);
      if (!deletedBranch) {
        throw new Error("Branch not found");
      }
      return { success: true, message: "Branch deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting Branch: " + error.message);
    }
  };
