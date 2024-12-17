import { supabase } from "./supabaseClient.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app=express();
app.use(bodyParser.json())
app.use(cors());

app.post('/register',async(req,res)=>{
    try{
        const { name, eid, email, mobileno, department, doj, role } = req.body;

        const ifEmailExists=async(email)=>{
            const {data,error}=await supabase
            .from("users")
            .select("email")
            .eq("email",email);

            if(error) throw new Error(`error checking email: ${error.message}`);
            return data.length>0;
        }

        const ifIdExists = async (eid) => {
            const { data, error } = await supabase
                .from("users")
                .select("eid")
                .eq("eid", eid);

            if (error) throw new Error(`Error checking ID: ${error.message}`);
            return data.length > 0;
        }

        const emailExists = await ifEmailExists(email);
        const idExists = await ifIdExists(eid);

        if (emailExists) {
          console.log("email exists");
            return res.status(400).json({ message: "exist-email" });
        }

        if (idExists) {
          console.log("id exists");
            return res.status(400).json({ message: "exist-id" });
        }

        const saveData = async () => {
            const { data, error } = await supabase
                .from("users")
                .insert({
                    name,
                    eid,
                    email,
                    mobileno,
                    department,
                    doj,
                    role,
                })
                .select(); 

            if (error) throw new Error(`Error saving data: ${error.message}`);
            return data;
        };

        const insertedData = await saveData();
        res.status(200).json({ message: "User registered successfully", data: insertedData });

    }
    catch(e){
        console.error(`Error in /register endpoint: ${e.message}`);
        res.status(500).json({ message: "Internal server error" });
    }


})

app.listen(8080,()=>{
    console.log("server is running on porty 8080");
  })
