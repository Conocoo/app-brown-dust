import type { MercenaryTemplate } from '../../../types/mercenary'

export const leto: MercenaryTemplate = {
  id: 'leto',
  name: '르토',
  type: 'attacker',
  star: 4,
  maxHp: 3837,
  atk: 1681,
  def: 0,
  emoji: '⚔️',
  imageId: '895',
  critRate: 20,
  critDamage: 75,
  agility: 65,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'stun', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'taunt_immune', value: 0, duration: 35, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
