require('dotenv').config();

export = (req: any,res: any,next: any) => {
    const authUser: any = req.header("x-auth-user");
    if(!authUser){
        return res.status(400).send(`You don't have right to access here!`);
    } else {
        if(process.env.verifiedUsers?.split(', ').includes(authUser)){
            next();
        } else {
            return res.status(403).send(`You cannot get this data!`);
        }
    }
}