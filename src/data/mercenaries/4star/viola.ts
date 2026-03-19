import type { MercenaryTemplate } from '../../../types/mercenary'

export const viola: MercenaryTemplate = {
  id: 'viola',
  name: '바이올라',
  type: 'attacker',
  star: 4,
  maxHp: 3642,
  atk: 778,
  def: 3,
  emoji: '⚔️',
  imageId: '1025',
  critRate: 15,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [
      { type: 'silence', value: 0, duration: 10, debuffClass: 'cc' },
      { type: 'dot', value: 0.03, duration: 6, debuffClass: 'dot' },
      { type: 'summon', value: 0, duration: 10, debuffClass: 'stat_weaken' },
    ],
  },
}
