import type { MercenaryTemplate } from '../../../types/mercenary'

export const uribel: MercenaryTemplate = {
  id: 'uribel',
  name: '우리벨',
  type: 'defender',
  star: 5,
  maxHp: 14827,
  atk: 1000,
  def: 20,
  emoji: '🛡️',
  imageId: '4315',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'added_buff_25', value: 0, duration: 20, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_31', value: 0.55, debuffClass: 'dot' },
    ],
  },
}
