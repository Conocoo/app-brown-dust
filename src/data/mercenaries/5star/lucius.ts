import type { MercenaryTemplate } from '../../../types/mercenary'

export const lucius: MercenaryTemplate = {
  id: 'lucius',
  name: '루시우스',
  type: 'defender',
  star: 5,
  maxHp: 9064,
  atk: 1118,
  def: 20,
  emoji: '🛡️',
  imageId: '2885',
  critRate: 25,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'revival', value: 0, duration: 100, buffType: 'special', target: 'self' },
      { type: 'dot_30', value: 0.35, debuffClass: 'dot' },
      { type: 'added_buff_27', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
