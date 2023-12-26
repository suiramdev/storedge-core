#!/bin/bash

pnpm run db:push
pnpm run db:seed
pnpm run start
