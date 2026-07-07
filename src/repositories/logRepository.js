import prisma from "../config/prisma.js";

class LogRepository {

    async create(data){

        return prisma.logEntry.create({
            data
        });

    }

    async findLatest(){

        return prisma.logEntry.findFirst({

            orderBy:{
                id:"desc"
            }

        });

    }

    async findById(id){

        return prisma.logEntry.findUnique({

            where:{
                id
            }

        });

    }

    async findMany(filters){

        return prisma.logEntry.findMany(filters);

    }

}

export default new LogRepository();
