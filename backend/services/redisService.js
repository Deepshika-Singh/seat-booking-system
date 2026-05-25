import redis from "../config/redis.js";
async function lockSeat(showId,seatNo,userId){
  try{
    const key =`${showId}:${seatNo}`;
    // const result = await redis.set(key,userId,{
    //   NX:true,
    //   EX:300
    // });
    const value = JSON.stringify({
  userId,
  createdAt: Date.now(),
  showId,
  seatNo
});

    const result = await redis.set(
      key,
      value,
      "EX",
      300,
      "NX"
    );
    if(!result){
      return{
        success: false,
        message:"Seat is already locked"
      };
    }
    return{
      success: true,
      message:"Seat Locked"
    }
  }catch(error){
    console.error("Error locking seat :",error);
    return{
      success:false,
      message:"Internal error"
    };
  }
  
};
async function isSeatLocked(showId, seatNo) {
  try{
  const key =`${showId}:${seatNo}`;
    const result = await redis.get(key);
    return result ? JSON.parse(result) : false;
  } catch(error){
    console.error("error checking seat lock:",error);
    return false;
  }
};
// async function unlockSeat(showId, seatNo) {
//   try{
//   const key =`${showId}:${seatNo}`;
//     const result = await redis.del(key);
//     if(result) return true;
//     return false;
//   } catch(error){
//     console.error("error unlocking seat :",error);
//     return false;
//   }
// };
async function unlockSeat(showId, seatNo, userId) {
  try {
    const key = `${showId}:${seatNo}`;
    const data = await redis.get(key);

    if (!data) return false;

    const parsed = JSON.parse(data);

    if (parsed.userId !== userId) {
      return false; // prevent unauthorized unlock
    }

    await redis.del(key);
    return true;
  } catch (error) {
    console.error("error unlocking seat :", error);
    return false;
  }
}
export {lockSeat,isSeatLocked,unlockSeat};