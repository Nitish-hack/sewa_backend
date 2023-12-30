const User = require("../models/userModel");

module.exports.addUser = async (req, res) => {
    try {
        const { name, chargerid, setid, earphone } = req.body;
        if(chargerid!==""){
        const user2 = await User.findOne({ chargerid: chargerid });
        if(user2) return res.status(409).json({ error: 'Charger id already occupied!' });
        }
        if(setid!==""){
        const user3 = await User.findOne({ setid: setid });
        if(user3) return res.status(409).json({ error: 'Set id already occupied!' });
        }
       
        const data={
            name,
            chargerid:chargerid?chargerid:"0000",
            setid:setid?setid:"0000",
            earphone:earphone?earphone:false
        }
        const newUser = new User(data);
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}
module.exports.allUser = async (req, res) => {
    try {
        const { page = 1, perPage = 25, name, filter } = req.query;

        let query = name ? { name: { $regex: new RegExp(name, 'i') } } : {};

        // Apply additional filtering based on the selected filter
        if (filter) {
            switch (filter) {
                case 'earphone':
                    query.earphone = true;
                    break;
                case 'chargerid':
                    query.chargerid = { $ne: '0000' }; // Exclude users with chargerid==='0000'
                    break;
                case 'setid':
                    query.setid = { $ne: '0000' }; // Exclude users with setid==='0000'
                    break;
                default:
                    // Handle unknown filters or do nothing for 'No Filter'
                    break;
            }
        }

        const data = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / perPage);

        res.status(200).json({ data, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports.returnUser = async (req, res) => {
    try {

      
        const { returnSetId, returnEarphone, returnChargerId, userid } = req.body;

        const user1 = await User.findById({ _id: userid });
        const user2 = await User.findOne({ chargerid: returnChargerId });
        const user3 = await User.findOne({ setid: returnSetId });

if(returnChargerId!=="" &&  !user2) res.status(200).json({returned:false,message:"charger id does not exist"}); 
if(returnSetId!=="" &&  !user3) res.status(200).json({returned:false,message:"set id does not exist"}); 

if(returnChargerId!==""){
        if (userid !== user2._id.toString()) {
            const temp = user1.chargerid;
            user1.chargerid ="0000";
            user2.chargerid = temp;
        }
        else {
            user1.chargerid="0000";
            user2.chargerid="0000";   //they both are same user 
        }
    }
    if(returnSetId!==""){
        if (userid !== user3._id.toString()) { 
            const temp = user1.setid;
            user1.setid = "0000";
            user3.setid = temp;
        }
        else{
            user1.setid="0000";
            user3.setid="0000";   //they both are same user 
        }
    }

    if(user1.earphone===true &&  returnEarphone===true) user1.earphone=false;
  
    let del=false;
    if(user1.setid==="0000" && user1.chargerid==="0000" && user1.earphone===false) del=true;

     if(user1)   await user1.save();
     if(user2)   await user2.save();
    if(user3)    await user3.save();

     if(del) {
        await User.findByIdAndDelete(user1._id);
        res.status(200).json({deleted:true, message: 'return is successfull!' ,user:user1});
     }

  else  res.status(200).json({deleted:false, message: 'return is successfull!' ,user:user1});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}


