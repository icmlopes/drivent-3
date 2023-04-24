import { prisma } from "@/config";
import faker from "@faker-js/faker";


export function createHotel(){
    return prisma.hotel.create({
        data:{
            name: faker.name.findName(),
            image: faker.image.abstract(),
        }
    })
}

export function createHotelRoom(hotelId: number){
    return prisma.room.create({
        data:{
            name: faker.name.firstName(),
            capacity: faker.datatype.number({min: 0, max: 5}),
            hotelId: hotelId,
        }
    })
}