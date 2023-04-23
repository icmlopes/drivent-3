import { notFoundError, paymentRequiredError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import hotelsRepository from "@/repositories/hotels-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import ticketService from "../tickets-service"

async function getHotels(userId:number){

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if(!enrollment){
        throw notFoundError()
    }

    const ticket  = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if (!ticket) {throw notFoundError()}


    if(ticket.TicketType.includesHotel === false|| ticket.status !== "PAID" || ticket.TicketType.isRemote === true){
        throw paymentRequiredError()
    }

    const findHotels = await hotelsRepository.findHotels()
    if(!findHotels){
        throw notFoundError()
    }

    return findHotels
     
}

const hotelService = { getHotels }

export  default hotelService
