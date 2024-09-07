const { text } = require("body-parser");
const userData = require("../models/contact.js"); 


const findData = async (data) => {
    try { 
        const { username, email} = data; 
        if(username && email){
             const found = await userData 
            .findone({ 
                email: email,
                username: username,
             })  
            .exec() 
            .select("-age"); 
            } else if (username) {
                const found = await userData  
                .findone({ username: username, })
                .exec();
            } else if (email) {
                 const found = await userData  
                 .findone({ 
                    email: email,
                 }) 
                 .exec() 
                 .select("-age");
                }else found = null;
                return found;
            } catch(err){
                console.error(err);
                return 500;
            }
        }
    const insertData = async(data)=>{
        try{
            const{ username, email, age} = data ;
            const user = new userData({
                username,
                email,
                age
            });
            await user.save();
            return user;
        } catch(err){
            console.log(err);
            return 500;
        }
    }
        const deleteData = async(data)=>{
            try{
                const{ username, email, age} = data ;
                const user = new userData({
                    username,
                    email,
                    age,
                });
                const result = await findOneAndDelete(user).exec();
                return result;
            } catch(err){
                console.log(err);
                return 500;
            }
        }

        const updateData = async(data)=>{
            try{
                const{ username, email, age, newUsername , newage} = data ;
                varnName = (newAge = false);
                if (newUsername) nName = true ;
                if (newUsername) nName = true ;
                const filter = {
                    username,
                    email,
                    age,
                };

                var newData = {};
                if(nName && newAge){
                    newData={
                        username: newUsername,
                        age: newAge,
                    };
                }else if(nName){
                    newData = {
                        username: newUsername,
                        age: newAge,
                    };
                }else if(newAge){
                    newData = {
                        age: newAge,
                    };
                }
                const result = await userData 
                .findOneAndUpdate(filter, newData,{new : true}).select("-age");
                return result;
            } catch(err){
                console.log(err);
                return 500;
            }
        };
        module.exports={
            findData,
            insertData,
            deleteData,
            updateData
            
        };