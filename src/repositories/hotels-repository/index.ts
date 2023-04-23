import { prisma } from "@/config";



async function findHotels(){
    return prisma.hotel.findMany()
}


export default { findHotels };
