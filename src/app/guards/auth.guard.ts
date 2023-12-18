import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MembersService } from '../stores/members.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const sMember = inject(MembersService)
  let member = sMember.getMe()
  const stored = sessionStorage.getItem('member')
  if (!member && stored) {
    member = await sMember.loadMember(stored)
  }

  return !!member;
};
