import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  sdk,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.pemu.pemumobile",
  projectId: "6649d3460035cdcc7599",
  storageId: "66992804000f1d500911",
  databaseId: "6649d36d0034e56943bb",
  userCollectionId: "6699264b0022b5e31fa5",
  videoCollectionId: "663e0219001b8da5888f",
  farmersCollectionId: "669926ac0023ba72ae9f",
  farmerDetailsCollectionId: "6649ef42002bcf7c82f0",
  visitCollectionId: "664a3a920029d85ac8a3",
  farmervisitsCollectionId: "66992793001dad855131",
  productsCollectionId: "6699fe450025f8b61d2c",
  farmersTransactionsCollectionId: "6699fea8001f8424cbc5",
  helaCollectionId: "666d5dc300100e94cdf9",
  farmerCropsCollectionId: "669925a30010314abc7b",
  farmerUnitsCollectionId: "6699ff9d002c650a0bc5",
  farmerHarvestsCollectionId: "669f625500189dfe221c",
  pemuPaymentCollectionId: "66a33fca0006382add49",
};


const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);



// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}


// Get Current User
export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
};

//Get Farmers
export const getLatestFarmers = async () => {

  try{

    const farmers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmersCollectionId,
      [
        
        Query.orderDesc('$createdAt'),
        Query.limit(3)
      ],
     
      
    );

    
    return farmers.documents;
  }
  catch(error){
    throw new Error(error)
  }

};


export const searchFarmers = async (query) => {
  try {
    const farmers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmersCollectionId,
      [Query.search("name", query)]
    );

    return farmers.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserFarmers = async (userId) => {
  try {
    const farmers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmersCollectionId,
      [Query.equal('users', userId)]
    );

    return farmers.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () =>{

  try {
    const session = await account.deleteSession('current');
    return session;
    
  } catch (error) {
    throw new Error(error)
    
  }

};

export const creatFarmer =async(form) =>{

  try {
    if (!form.userId || form.userId.trim() === "") {
      console.log("User id",form.userId)
      throw new Error("Please Try Again"); 
  }
    const avatarUrl = avatars.getInitials(form.name);
    const farmer = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmersCollectionId,
      ID.unique(),
      {
        name: form.name,
        phonenumber: form.phonenumber,
        users: form.userId,
        location: form.location,
        IDnumber: form.IDnumber,
        type: form.type,
        avatar: avatarUrl,

      },[]
    );

    return farmer;
  } catch (error) {
    throw new Error(error)
  }

};



export const creatFarmerDetails =async(form) =>{

  try {
   
    const farmer_Details = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerDetailsCollectionId,
      ID.unique(),
      {
        treatments: form.treatments,
        crops: form.crops,
        farm_size: form.area,
        farmerID: form.farmerID,
        coordinates: form.coordinates,
        Farmcoordinates: form.Farmcoordinates,
      },[]
    );

    return farmer_Details;
  } catch (error) {
    throw new Error(error)
  }

};


export const getFarmerDetails = async (farmerID) => {
  try {
    const farmerDetails = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmerDetailsCollectionId,
      [Query.equal('farmerID', farmerID)]
    );

    return farmerDetails;
  } catch (error) {
    throw new Error(error);
  }
};


export const updatefarmerdetails = async (form, documentId) => {
  try {
    const farmerDetails = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerDetailsCollectionId,
      documentId,
      {
        treatments: form.treatments,
        crops: form.crops,
        farm_size: form.size,
        farmerID: form.farmerID,
        coordinates: form.coordinates,
        Farmcoordinates: form.Farmcoordinates,
      }
    );

    return farmerDetails;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVisit=async(form) =>{

  try {
   
    const visit = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.visitCollectionId,
      ID.unique(),
      {
        reason: form.reason,
        date: form.date,
        comments: form.comments,
        farmerID: form.farmerID,
        users: form.userId,
      },[]
    );

    return visit;
  } catch (error) {
    throw new Error(error)
  }

};

export const getUserVisits = async (userId) => {
  try {
    const farmers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmervisitsCollectionId,
      [
        Query.orderDesc('$createdAt'),
        Query.equal('users', userId)
      ]
    );

    return farmers.documents;
  } catch (error) {
    throw new Error(error);
  }
};


export const getFarmerById = async (farmerID) => {
  if (!farmerID) {
    throw new Error('Invalid farmerID');
  }

  try {
    const farmer = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmersCollectionId,
      farmerID
    );

    return farmer;
  } catch (error) {
    throw new Error(error);
  }
};



export const getFarmerVisits = async (farmerID) => {
  try {
    const visit = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmervisitsCollectionId,
      [Query.equal('farmerID', farmerID)]
    );

    return visit.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview =async (fileId, type) =>{
  let fileUrl;

  try {
    if (type === 'image'){
      fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100);
    }
    else{
      throw new Error('Invalid file type');
    }

    if(!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }

}


export const uploadFile =async (file, type) => {
  if(!file) return;

  const {mimeType, ...rest} =file;
  const asset = {type: mimeType, ...rest};

  try {
    
    const uploadedFile =await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);


    return fileUrl;

  } catch (error) {
    throw new Error(error);
  }

}

export const createFarmerVisit = async (form) => {

  try {

    const pictureUrl = await uploadFile(form.picture1, 'image');
    const newFarmerVisit = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmervisitsCollectionId,
      ID.unique(),
      {
        activities: form.activities,
        inputs: form.inputs,
        observations: form.observation,
        recommendation: form.recommendation,
        coordinates: form.coordinates,
        picture1: pictureUrl,
        users: form.userId, 
        farmerID: form.farmerID,

      },[]

    )
    return newFarmerVisit;
    
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

}


//Get Visits
export const getLatestVisits = async () => {

  try{

    const visits = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmervisitsCollectionId,
      [
        
        Query.orderDesc('$createdAt'),
        Query.limit(3)
      ],
     
      
    );

    
    return visits.documents;
  }
  catch(error){
    throw new Error(error)
  }

};


export const getVisitDetails = async (farmerID, visitID) => {
  try {
    const visitDetails = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmervisitsCollectionId,
      [
        Query.equal('farmerID', farmerID),
        Query.equal('$id', visitID) 
      ]
    );

    return visitDetails;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

//Get Farmers
export const getAllFarmers = async () => {
  let allFarmers = [];
  let hasMore = true;
  let lastDocumentId = null;

  try {
    while (hasMore) {
      const options = [
        Query.orderDesc('$createdAt'),
      ];

      if (lastDocumentId) {
        options.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.farmersCollectionId,
        options,
      );

      allFarmers = allFarmers.concat(response.documents);
      lastDocumentId = response.documents.length > 0 ? response.documents[response.documents.length - 1].$id : null;
      hasMore = response.total > allFarmers.length;
    }

    return allFarmers;
  } catch (error) {
    throw new Error(error);
  }
};


//Get Visits
export const getAllVisits = async () => {

  try{

    const visits = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmervisitsCollectionId,
      [
        Query.orderDesc('$createdAt'),
      ],
     
    );
    return visits.documents;
  }
  catch(error){
    throw new Error(error)
  }

};

export const getTopCrop = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmerDetailsCollectionId
    );


    const documents = response.documents;
    
 
    const cropCounts = {};

    documents.forEach(doc => {
      const crops = doc.crops.split(',');
      crops.forEach(crop => {
        crop = crop.trim();
        if (cropCounts[crop]) {
          cropCounts[crop]++;
        } else {
          cropCounts[crop] = 1;
        }
      });
    });


    let topCrop = null;
    let maxCount = 0;

    for (const crop in cropCounts) {
      if (cropCounts[crop] > maxCount) {
        topCrop = crop;
        maxCount = cropCounts[crop];
      }
    }

    return topCrop;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};
export const getTopInput = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmerDetailsCollectionId
    );


    const documents = response.documents;
    
 
    const inputsCounts = {};

    documents.forEach(doc => {
      const inputs = doc.treatments.split(',');
      inputs.forEach(input => {
        input = input.trim();
        if (inputsCounts[input]) {
          inputsCounts[input]++;
        } else {
          inputsCounts[input] = 1;
        }
      });
    });


    let topInput = null;
    let maxCount = 0;

    for (const input in inputsCounts) {
      if (inputsCounts[input] > maxCount) {
        topInput = input;
        maxCount = inputsCounts[input];
      }
    }

    return topInput;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

//Get Products
export const getAllProducts = async () => {
  let allProducts = [];
  let hasMore = true;
  let lastDocumentId = null;

  try {
    while (hasMore) {
      const options = [
        Query.orderAsc('$createdAt'),
      ];

      if (lastDocumentId) {
        options.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.productsCollectionId,
        options,
      );

      allProducts = allProducts.concat(response.documents);
      lastDocumentId = response.documents.length > 0 ? response.documents[response.documents.length - 1].$id : null;
      hasMore = response.total > allProducts.length;
    }

    return allProducts;
  } catch (error) {
    throw new Error(error);
  }
};


//Create Transaction
export const createFarmerTransaction = async (form) => {

  try {
    const newFarmerTransaction = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmersTransactionsCollectionId,
      ID.unique(),
      {
        farmerID: form.farmerID,
        product_name: form.products,
        quantity: form.quantity,
        units: form.units,
        amount:form.amount,
        payment_method: form.payment_method,
        Mpesa_Code: form.Mpesa_Code,
        CropID: form.CropID,
        unitID: form.unitID,
      },[]

    )
    return newFarmerTransaction;
    
  } catch (error) {
    throw new Error(error);
  }

}

//Create Hela Account
export const createHelaAccount = async (form) => {
  try {
    const newHelaAccount = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.helaCollectionId,
      ID.unique(),
      {
        farmerID: form.farmerID,
        accountNumber: form.accountNumber,
        InitialAmount: form.InitialAmount,
        RemainingAmount: form.InitialAmount,
        Status: true,
      },[]

    )
    return newHelaAccount;
    
  } catch (error) {
    throw new Error(error);
  }

}

// Check if farmer has an active Hela account
export const checkHelaAccount = async (farmerID) => {
  try {
    const helaAccount = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.helaCollectionId,
     [
      Query.equal('farmerID', farmerID)
     ]
    );
    const activeAccount = helaAccount.documents.find(account => account.Status === true);
    if (activeAccount) {
      return {
        isActive: true,
        account: activeAccount,
       
      };
    } else {
      return {
        isActive: false,
        account: null
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
// Check if farmer has an active Hela account
export const getActiveHelaAccount = async (farmerID) => {
  try {
    const helaAccount = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.helaCollectionId,
     [
      Query.equal('farmerID', farmerID)
     ]
    );
    const activeAccount = helaAccount.documents.find(account => account.Status === true);
    return activeAccount;
  } catch (error) {
    throw new Error(error.message);
  }
};


//Update Hela account after transaction
export const updateHelaAccount = async (form, farmerID) => {
  try {
    
    const helaAccount = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.helaCollectionId,
      [
        Query.equal('farmerID', farmerID)
      ]
    );

    const activeAccount = helaAccount.documents.find(account => account.Status === true);

    if (!activeAccount) {
      throw new Error(`No active Hela account found for farmerID: ${farmerID}`);
    }

    const firstamount= parseFloat(activeAccount.RemainingAmount);
    const secondamount = parseFloat(form.amount);
    const result= firstamount -secondamount;
   
    activeAccount.RemainingAmount = result.toString();
    const finst = activeAccount.RemainingAmount;
    const updatedRemaining = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.helaCollectionId,
      activeAccount.$id,
      {
        RemainingAmount: finst,
      }
    );

    return updatedRemaining;
  } catch (error) {
    throw new Error(error.message);
  }
};


// Check if farmer has an active Hela account
export const checkAllAccounts = async (farmerID) => {
  try {
    const helaAccount = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.helaCollectionId,
     [
      Query.equal('farmerID', farmerID)
     ]
    );

    return helaAccount;
    
  } catch (error) {
    throw new Error(error.message);
  }
};

// //Get transactions for [Farmer]
export const getFarmerTransactions = async (farmerID) => {
  try {
    const Transaction = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmersTransactionsCollectionId,
      [
        Query.equal('farmerID', farmerID),
        Query.orderDesc('$createdAt')
      ]
    );

    return Transaction;
  } catch (error) {
    throw new Error(error);
  }
};





//Create crop for farmer
export const createFarmerCrop=async(form) =>{

  try {
   
    const cropDebt= "0";
    const Crop = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerCropsCollectionId,
      ID.unique(),
      {
        crop_name: form.crop_name,
        planting_date: form.planting_date,
        harvest_date: form.harvest_date,
        field_size: form.field_size,
        farmerID: form.farmerID,
        debt: cropDebt,
      },[]
    );

    return Crop;
  } catch (error) {
    console.log(error);
    throw new Error(error);
    
  }

};

//Get crops for [Farmer]
export const getFarmerCrops = async (farmerID) => {
  try {
    const Crops = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmerCropsCollectionId,
      [
        Query.equal('farmerID', farmerID),
        Query.orderDesc('$createdAt')
      ]
    );

    return Crops;
  } catch (error) {
    throw new Error(error);
  }
};

//Close Hela Account
export const closeHelaAccount = async (farmerID) => {
  try {
    const helaAccount = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.helaCollectionId,
     [
      Query.equal('farmerID', farmerID)
     ]
    );
    const activeAccount = helaAccount.documents.find(account => account.Status === true);
    if (!activeAccount) {
      throw new Error(`No active Hela account found for farmerID: ${farmerID}`);
    }
    activeAccount.Status = false;
    const updatedAccount = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.helaCollectionId,
      activeAccount.$id,
      {
        Status: false,
      }
    );
    return updatedAccount;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Get crops for Units [Farmer]
export const getFarmerCrops_Units = async (farmerID) => {
  try {
    const Crops = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmerCropsCollectionId,
      [
        Query.equal('farmerID', farmerID),
        Query.orderDesc('$createdAt')
      ]
    );

    return Crops;
  } catch (error) {
    throw new Error(error);
  }
};

//Create Unit for farmer
export const createFarmerUnit=async(form) =>{

  try {
   
    const unit = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerUnitsCollectionId,
      ID.unique(),
      {
        CropID: form.CropID,
        unit_name: form.unit_name,
        farmerID: form.farmerID,
      },[]
    );

    return unit;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

};

//Get crops for Units [Farmer]
export const getFarmerUnits = async (farmerID) => {
  try {
    const Units = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmerUnitsCollectionId,
      [
        Query.equal('farmerID', farmerID),
        Query.orderDesc('$createdAt')
      ]
    );

    return Units;
  } catch (error) {
    throw new Error(error);
  }
};

//Create Harvest for farmer
export const createFarmerHarvest=async(form) =>{

  try {
   
    const harvest = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerHarvestsCollectionId,
      ID.unique(),
      {
        CropID: form.CropID,
        total_kgs: form.total_kgs,
        accepted_kgs: form.accepted_kgs,
        value_per_kg: form.value_per_kg,
        total_value: form.total_value,
        farmerID: form.farmerID,
        is_payed: false,
      },[]
    );

    return harvest;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

};
//Get crops for Units [Farmer]
export const getFarmerHarvests = async (farmerID) => {
  try {
    const Harvests = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmerHarvestsCollectionId,
      [
        Query.equal('farmerID', farmerID),
        Query.equal('is_payed', false),
        Query.orderDesc('$createdAt')

      ]
    );

    return Harvests;
  } catch (error) {
    throw new Error(error);
  }
};


///update Harvest details
export const updateHarvestdetails = async (documentId) => {
  try {
    const harvestDetails = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerHarvestsCollectionId,
      documentId,
      {
        is_payed: true,
      }
    );

    return harvestDetails;
  } catch (error) {
    throw new Error(error);
  }
};

//create pemu payment
export const createPemuPayment = async (form) => {
  try {
    const newPemuPayment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.pemuPaymentCollectionId,
      ID.unique(),
      {
        farmerID: form.farmerID,
        HarvestIDs: form.HarvestIDs,
        amount_deducted: form.amount_deducted,
        amount_payed: form.amount_payed,
        debt_balance: form.debt_balance,
      },[]
    )
    return newPemuPayment;
    
  } catch (error) {
    throw new Error(error);
  }

}

//update crop debt
export const UpdateCropDebt = async (form) => {
  try {
    // Fetch the current debt value for the crop
    const cropData = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerCropsCollectionId,
      form.CropID
    );
    
    const currentDebt = parseFloat(cropData.debt) || 0; // Assume 0 if debt is not set
    
    const debtToAdd = parseFloat(form.amount);

    // Calculate the new debt value
    const newDebt = currentDebt + debtToAdd;
    const finalDebt = newDebt.toString();
    
    // Update the debt value in the database
    const cropDebt = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerCropsCollectionId,
      form.CropID,
      {
        debt: finalDebt,
      }
    );

    return cropDebt;
    
  } catch (error) {
    throw new Error(error);
  }
}

//update crop debt after payment
export const UpdateCropDebtPayment = async (form) => {
  try {
    // Fetch the current debt value for the crop
    const cropData = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerCropsCollectionId,
      form.CropID
    );
    
    console.log("Crop ID:", form.CropID);
    const currentDebt = cropData.debt;
    
    
    const debtToDeduct = parseFloat(form.amount_deducted);
    console.log("Debt to Deduct:", debtToDeduct);
    console.log("Current Debt:", currentDebt);

    // Calculate the new debt value
    const newDebt = currentDebt - debtToDeduct;
    const finalDebt = newDebt.toString();
    console.log("Final Debt:", finalDebt);
    
    // Update the debt value in the database
    const cropDebt = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.farmerCropsCollectionId,
      form.CropID,
      {
        debt: finalDebt,
      }
    );

    return cropDebt;
    
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
}
