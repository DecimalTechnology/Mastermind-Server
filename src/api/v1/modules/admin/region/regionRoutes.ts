import express from 'express'
import { RegionRepository } from './regionRepository';
import { RegionServices } from './regionServices';
import { RegionController } from './regionController';
import { adminAuth } from '../../../../../middewares.ts/authenticateAdmin';
import roleAuth from '../../../../../middewares.ts/roleAuth';
import { UserRole } from '../../../../../enums/common';
import asyncHandler from '../../../../../validations/asyncHandler';

const regionRouter  = express.Router();

const regionRepository = new RegionRepository();
const regionServices = new RegionServices(regionRepository);
const  controller = new RegionController(regionServices)
 
regionRouter.get('/users',adminAuth,roleAuth(UserRole.SUPER_ADMIN,UserRole.NATIONAL_ADMIN),asyncHandler(controller.getAllUsers.bind(controller)))
regionRouter.post('/',adminAuth,roleAuth(UserRole.SUPER_ADMIN,UserRole.NATIONAL_ADMIN),asyncHandler(controller.createRegion.bind(controller)))
regionRouter.get('/',adminAuth,roleAuth(UserRole.SUPER_ADMIN,UserRole.NATIONAL_ADMIN),asyncHandler(controller.findAllRegions.bind(controller)))
regionRouter.get('/',adminAuth,roleAuth(UserRole.SUPER_ADMIN,UserRole.NATIONAL_ADMIN),asyncHandler(controller.findAllRegions.bind(controller)))
regionRouter.get('/:id',adminAuth,roleAuth(UserRole.SUPER_ADMIN,UserRole.NATIONAL_ADMIN,UserRole.REGIONAL_ADMIN),asyncHandler(controller.findRegionById.bind(controller)))

export default regionRouter;
