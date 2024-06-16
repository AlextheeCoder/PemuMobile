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
  projectId: "663e00bc001c9e496ecb",
  storageId: "663e024a00327799c407",
  databaseId: "663e01d90004a67343d0",
  userCollectionId: "663e0203000e7b0a524c",
  videoCollectionId: "663e0219001b8da5888f",
  farmersCollectionId: "664092f900220c7e3cb9",
  farmerDetailsCollectionId: "6649ef42002bcf7c82f0",
  visitCollectionId: "664a3a920029d85ac8a3",
  farmervisitsCollectionId: "665c84b0000d27c51398",
  productsCollectionId: "666c8468000292f43061",
  farmersTransactionsCollectionId: "666c906900241e929a02",
  helaCollectionId: "666d5dc300100e94cdf9",
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
        farm_size: form.size,
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
    throw new Error(error);
  }
};

//Get Farmers
export const getAllFarmers = async () => {

  try{

    const farmers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.farmersCollectionId,
      [
        Query.orderDesc('$createdAt'),
      ],
    );

    return farmers.documents;
  }
  catch(error){
    throw new Error(error)
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

  try{

    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      [
        Query.orderDesc('$createdAt'),
      ],
    );
    return products.documents;
  }
  catch(error){
    throw new Error(error)
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
        account: activeAccount
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

//Get transactions for [Farmer]
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