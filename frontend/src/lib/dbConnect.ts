import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?:number // this means it is optional but it is a number
}

const connection : ConnectionObject = {}; // i am able to keep it optional because it is optional (? is used in connectionObject)

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }
    //  if we are already connected to database then we don't want to connect again...using this check helps us to improve the performance of our application, and a choking database connection will not affect the performance of our application
    // Choking in this context means overloading or overwhelming the database with too many connections, which can degrade performance or cause failures. By checking if a connection already exists before creating a new one, you prevent unnecessary connections and avoid "choking" the database.

    try {
       const db =  await mongoose.connect(process.env.MONGO_URI || "",{})

       connection.isConnected = db.connections[0].readyState; // this is used to check if the connection is ready

       console.log("Connected to database")
    } catch (error) {
        console.log("DB Connection failed",error);
        process.exit(1); // this is used to exit the process
    }
}

export default dbConnect;