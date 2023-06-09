import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";


export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction){

    const { userId } = req

    try{

        const hotels = await hotelService.getHotels(userId)

        return res.status(httpStatus.OK).send(hotels)

    } catch(e){
        next(e)
    }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response, next: NextFunction){

    const hotelId = Number(req.params.hotelId)
    const { userId } = req;


    try{

        const rooms = await hotelService.getHotelRooms(hotelId, userId) 

        return res.status(httpStatus.OK).send(rooms)

    } catch(e){
        next(e)
    }
}
