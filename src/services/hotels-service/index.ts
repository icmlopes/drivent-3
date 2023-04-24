import { notFoundError, paymentRequiredError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import hotelsRepository from "@/repositories/hotels-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import ticketService from "../tickets-service"
import paymentsRepository from "@/repositories/payments-repository"

async function getHotels(userId:number){

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if(!enrollment){
        throw notFoundError()
    }

    const ticket  = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if (!ticket) {throw notFoundError()}

    console.log('Checando se está chegando o ticket aqui', ticket.id)


    if(ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true){
        console.log("ASlou pra ver se entra" )
        throw paymentRequiredError()
    }

    if(ticket.status === "RESERVED"){
        throw paymentRequiredError()
    }


    // if(ticket.TicketType.isRemote === true){
    //     console.log("Teste testando")
    //     throw paymentRequiredError()
    // }

    // const payment = await paymentsRepository.findPaymentByTicketId(ticket.id)
    // if(!payment){
    //     throw paymentRequiredError()
    // }

    // console.log('Tô aqui no server, vendo o payment', payment)
    const findHotels = await hotelsRepository.findHotels()

    if(findHotels === null){
        throw notFoundError()
    }

    return findHotels
     
}

async function getHotelRooms(hotelId: number){

    const rooms = await hotelsRepository.findHotelRooms(hotelId)
}

const hotelService = { 
    getHotels,
    getHotelRooms
 }

export  default hotelService
