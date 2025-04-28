const branch = require('../models/branch.model');

module.exports.getBranches = async () => {
    try{
        const branches = await branch.find({});
        return branches
    }catch (error)
    {
        throw new Error("Error getting branches: " + error.message);
    }
}

module.exports.getBranchById = async(branchId) => {
    try{
        const Branch = await branch.findOne({ _id:branchId});
        if (!Branch) {
            throw new Error("ID doesn't exist");
        }
        return Branch;
    }catch(error)
    {
        throw new Error("Error getting branch: " + error.message);
    }
}

module.exports.getBranchesByActive = async() => {
    try{
        const Branches = await branch.find({ isActive:true});
        if (!Branches) {
            throw new Error("not found any active branch");
        }
        return Branches;
    }catch(error)
    {
        throw new Error("Error getting active branches: " + error.message);
    }
}

module.exports.getBranchesByType = async(branchType) => {
    try{
        const Branches = await branch.find({ type:branchType});
        if (!Branches) {
            throw new Error("not found any branches with this type");
        }
        return Branches;
    }catch(error)
    {
        throw new Error("Error getting active branches: " + error.message);
    }
}

module.exports.getBranchByName = async(branchName) => {
    try{
        const Branch = await branch.findOne({ branchName:branchName});
        if (!Branch) {
            throw new Error("name doesn't exist");
        }
        return Branch;
    }catch(error)
    {
        throw new Error("Error getting branch: " + error.message);
    }
}

module.exports.addBranch = async(data) => {
    try {
        const newBranch = new branch(data);
        const savedBranch = await newBranch.save();
    
        return savedBranch
      } catch (error) {
        throw new Error("Error adding branch: " + error.message);
      }
}

module.exports.updateBranch = async (branchId, data) => {
    try {
      const updatedBranch= await branch.findByIdAndUpdate(branchId, data, { new: true });
      return updatedBranch;
    } catch (error) {
      throw new Error("Error updating branch: " + error.message);
    }
  };

    module.exports.updateBranchActive = async (branchId) => {
      try {
          const data = await branch.findById(branchId);
          if (!data) {
              throw new Error("Branch not found");
          }
  
          const updatedBranch = await branch.findByIdAndUpdate(
              branchId,
              { isActive: !data.isActive },
              { new: true }
          );
  
          return updatedBranch;
      } catch (error) {
          throw new Error("Error updating branch active: " + error.message);
      }
  };

module.exports.deleteBranch = async (branchId) => {
    try {
      const deletedBranch = await branch.findByIdAndDelete(branchId);
      return deletedBranch;
    } catch (error) {
      throw new Error("Error deleting branch: " + error.message);
    }
  };