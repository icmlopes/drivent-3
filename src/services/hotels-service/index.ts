import { notFoundError, paymentRequiredError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import hotelsRepository from "@/repositories/hotels-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import ticketService from "../tickets-service"
import paymentsRepository from "@/repositories/payments-repository"

async function validation(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if(!enrollment){
        throw notFoundError()
    }

    const ticket  = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if (!ticket) {throw notFoundError()}

    if(ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true){
        throw paymentRequiredError()
    }

    if(ticket.status === "RESERVED"){
        throw paymentRequiredError()
    }

}

async function getHotels(userId:number){

    await validation(userId)

    const findHotels = await hotelsRepository.findHotels()

    if(findHotels.length === 0 ){
        throw notFoundError()
    }

    return findHotels
     
}

// async function getHotels(userId:number){

//     const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

//     if(!enrollment){
//         throw notFoundError()
//     }

//     const ticket  = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
//     if (!ticket) {throw notFoundError()}

//     if(ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true){
//         throw paymentRequiredError()
//     }

//     if(ticket.status === "RESERVED"){
//         throw paymentRequiredError()
//     }


//     // if(ticket.TicketType.isRemote === true){
//     //     throw paymentRequiredError()
//     // }

//     // const payment = await paymentsRepository.findPaymentByTicketId(ticket.id)
//     // if(!payment){
//     //     throw paymentRequiredError()
//     // }
//     const findHotels = await hotelsRepository.findHotels()

//     if(findHotels === null){
//         throw notFoundError()
//     }

//     return findHotels
     
// }

async function getHotelRooms(hotelId: number, userId: number){

    await validation(userId)

    const rooms = await hotelsRepository.findHotelRooms(hotelId)

    if(!rooms){
        throw notFoundError()
    }

    return rooms
}

const hotelService = { 
    getHotels,
    getHotelRooms
 }

export  default hotelService
