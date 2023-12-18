#!/bin/bash

npx prisma db push
npx prisma db seed
npm run start
