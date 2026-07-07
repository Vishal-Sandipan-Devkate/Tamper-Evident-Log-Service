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

    async findAll() {
  return prisma.logEntry.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

async count(where) {
  return prisma.logEntry.count({
    where,
  });
}

async exportLogs(where, skip, take) {
  return prisma.logEntry.findMany({
    where,
    skip,
    take,
    orderBy: {
      id: "asc",
    },
  });
}

}

export default new LogRepository();
