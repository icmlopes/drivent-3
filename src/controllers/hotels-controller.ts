import { AuthenticatedRequest } from "@/middlewares";
import { hotelService } from "@/services/hotels-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";


export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction){
    try{

        const hotels = await hotelService // colocar aqui função do service

        return res.status(httpStatus.OK).send(hotels)

    } catch(e){
        next(e)
    }
}