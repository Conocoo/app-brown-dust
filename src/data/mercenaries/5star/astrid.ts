import type { MercenaryTemplate } from '../../../types/mercenary'

export const astrid: MercenaryTemplate = {
  id: 'astrid',
  name: '아스트리드',
  type: 'defender',
  star: 5,
  maxHp: 9725,
  atk: 993,
  def: 12,
  emoji: '🛡️',
  imageId: '1825',
  critRate: 15,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'regeneration', value: 8, duration: 10, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
