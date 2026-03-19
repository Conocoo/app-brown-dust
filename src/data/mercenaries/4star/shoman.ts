import type { MercenaryTemplate } from '../../../types/mercenary'

export const shoman: MercenaryTemplate = {
  id: 'shoman',
  name: '쇼멘',
  type: 'mage',
  star: 4,
  maxHp: 1148,
  atk: 5831,
  def: 0,
  emoji: '🔮',
  imageId: '4035',
  critRate: 40,
  critDamage: 250,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'summon', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.5, debuffClass: 'dot' },
    ],
  },
}
