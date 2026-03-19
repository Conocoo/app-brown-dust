import type { MercenaryTemplate } from '../../../types/mercenary'

export const hell: MercenaryTemplate = {
  id: 'hell',
  name: '헬',
  type: 'mage',
  star: 4,
  maxHp: 3952,
  atk: 4526,
  def: 0,
  emoji: '🔮',
  imageId: '1225',
  critRate: 20,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
