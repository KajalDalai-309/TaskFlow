import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Sprint } from './sprint.entity';
import { SprintService } from './sprint.service';
import { createSprintInput } from './dto/create-sprint.input';
import { updateSprintInput } from './dto/update-sprint.input';

import { Query } from '@nestjs/graphql';
import { startSprintInput } from './dto/start-sprint.input';



import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Resolver(() => Sprint)
export class SprintResolver {
  constructor(private readonly sprintService: SprintService) { }

  @Mutation(() => Sprint)
  @UseGuards(JwtAuthGuard)
  createSprint(
    @Args('input') input: createSprintInput,
    @CurrentUser() user: User,
  ): Promise<Sprint> {
    return this.sprintService.createSprint(input, user);
  }

  @Mutation(() => Sprint)
  @UseGuards(JwtAuthGuard)
  completeSprint(
    @Args('sprintId') sprintId: string,
    @CurrentUser() user: User,
  ): Promise<Sprint> {
    return this.sprintService.completeSprint(sprintId, user);
  }

  @Mutation(() => Boolean)
  checkExpiredSprints() {
    return this.sprintService.closeExpiredSprints();
  }


  @Mutation(() => Sprint)
  @UseGuards(JwtAuthGuard)
  updateSprint(
    @Args('input') input: updateSprintInput,
    @CurrentUser() user: User,
  ) {
    return this.sprintService.updateSprint(input, user);
  }

  @Mutation(() => Sprint)
  @UseGuards(JwtAuthGuard)
  startSprint(
    @Args('input') input: startSprintInput,
    @CurrentUser() user: User,
  ) {
    return this.sprintService.startSprint(input, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deleteSprint(
    @Args('sprintId') sprintId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.sprintService.deleteSprint(sprintId, user);
  }

  @Query(() => [Sprint])
  getSprintsByProject(
    @Args('projectId') projectId: string,
  ): Promise<Sprint[]> {
    return this.sprintService.getSprintsByProject(projectId);
  }

}
