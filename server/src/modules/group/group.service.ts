import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/commons/types';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { prismaGroupSelect } from './dto/group-select';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private prismaService: PrismaService) {}

  public async getGroups(groupName?: string, paginationDto?: PaginationDto) {
    const limit = paginationDto.limit || 25;
    const page = paginationDto.page || 1;
    if (!groupName) {
      const count = await this.prismaService.group.count();
      const groups = await this.prismaService.group.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      return { count, groups };
    }

    // Query group by name
    const count = await this.prismaService.group.count({
      where: { groupName: { contains: groupName, mode: 'insensitive' } },
    });
    const groups = await this.prismaService.group.findMany({
      where: { groupName: { contains: groupName, mode: 'insensitive' } },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { count, groups };
  }

  public async getGroupById(id: string) {
    return await this.prismaService.group.findUnique({
      where: { id },
      select: prismaGroupSelect,
    });
  }

  public async queryGroup(name: string) {
    return await this.prismaService.group.findMany({
      where: { groupName: { contains: name, mode: 'insensitive' } },
    });
  }

  public async createGroup(groupDto: CreateGroupDto) {
    const group = await this.prismaService.group.create({ data: groupDto });
    return group;
  }
  public async updateGroup(groupId: string, groupDto: UpdateGroupDto) {
    const updated = await this.prismaService.group.update({
      where: { id: groupId },
      data: groupDto,
    });
    return updated;
  }

  public async changeGroupManager(groupId: string, userId: string) {
    const updated = await this.prismaService.group.update({
      where: { id: groupId },
      data: {
        groupManager: { connect: { id: userId } },
      },
    });
    return updated;
  }
  public async deleteGroup(groupId: string) {
    await this.prismaService.group.delete({ where: { id: groupId } });
  }

  public async isUserBelongToGroup(userId: string, groupId: string) {
    const group = await this.prismaService.group.findUnique({
      where: { id: groupId },
      select: { members: true, groupManager: true },
    });
    if (!group) return false;
    const isManager = group.groupManager.id == userId;
    const isMember = group.members.some((user) => user.id == userId);

    return isManager || isMember;
  }

  public async userJoinGroup(groupId: string, userId: string) {
    const updatedGroup = await this.prismaService.group.update({
      where: { id: groupId },
      data: { members: { connect: { id: userId } } },
      select: prismaGroupSelect,
    });
    return updatedGroup;
  }
  public async userLeaveGroup(groupId: string, userId: string) {
    const updatedGroup = await this.prismaService.group.update({
      where: { id: groupId },
      data: { members: { disconnect: { id: userId } } },
      select: prismaGroupSelect,
    });
    return updatedGroup;
  }

  public async getJoinedGroupOfUser(userId: string, groupName = '') {
    const joinedGroups = await this.prismaService.group.findMany({
      where: {
        OR: [
          { members: { some: { id: userId } } },
          { groupManager: { id: userId } },
        ],
        AND: { groupName: { contains: groupName, mode: 'insensitive' } },
      },
    });
    return joinedGroups;
  }

  public async getGroupMembers(groupId: string) {
    const group = await this.prismaService.group.findUnique({
      where: { id: groupId },
      select: {
        members: { select: { id: true, username: true, email: true } },
      },
    });
    return group.members;
  }

  public async getRecentChatGroup(userId: string) {
    const groups = await this.prismaService.group.findMany({
      where: { groupMessages: { every: { userId } } },
    });
    return groups;
  }
}
