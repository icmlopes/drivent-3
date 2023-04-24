import app, { init } from "@/app";
import supertest from "supertest";
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket, createPayment } from '../factories';
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
    await init()
    await cleanDb()
})

beforeEach( async () => {
    await cleanDb()
})

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
        const token = await generateValidToken();
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with status 404 when user doesnt have a ticket yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it('Should responde with status 402 when it is not paid yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus["402_NAME"])
      })

      it('Should responde with status 402 when the has a ticket but includesHotel is false', async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const isRemote = false
        const includesHotel = false
        const ticketType = await createTicketType(isRemote, includesHotel)
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus["402_NAME"])
      })
  
      it('should respond with status 200 and hotel data', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const isRemote = false
        const includesHotel = true
        const ticketType = await createTicketType(isRemote, includesHotel)
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price)
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            expect.arrayContaining([{
                id: expect.any(Number),
                name: expect.any(String),
                image: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }])
        );
      });
    });
  });