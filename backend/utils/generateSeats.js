const generateSeats = (totalSeats) => {
  try{
    const seats = [];

    for (let i = 1; i <= totalSeats; i++) {

      seats.push({
        seatNumber: `A${i}`,
        status: "available",
      });

    }

    return seats;
  }catch(error){
    console.error("Error generating seats:", error);
    return [];
  }
}
export{generateSeats};