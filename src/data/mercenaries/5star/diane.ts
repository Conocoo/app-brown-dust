import type { MercenaryTemplate } from '../../../types/mercenary'

export const diane: MercenaryTemplate = {
  id: 'diane',
  name: '다이애나',
  type: 'attacker',
  star: 5,
  maxHp: 3915,
  atk: 1033,
  def: 0,
  emoji: '⚔️',
  imageId: '4595',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'extra_turn_2', value: 0, duration: 10, buffType: 'special', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 10, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
