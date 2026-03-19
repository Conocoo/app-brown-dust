import type { MercenaryTemplate } from '../../../types/mercenary'

export const lain: MercenaryTemplate = {
  id: 'lain',
  name: '레인',
  type: 'defender',
  star: 5,
  maxHp: 22021,
  atk: 7152,
  def: 10,
  emoji: '🛡️',
  imageId: '4535',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'passive',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'turn_pass', value: 0, duration: 38, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'summon', value: 0, duration: 38, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 2, duration: 24, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
