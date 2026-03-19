import type { MercenaryTemplate } from '../../../types/mercenary'

export const foxy: MercenaryTemplate = {
  id: 'foxy',
  name: '폭시',
  type: 'attacker',
  star: 5,
  maxHp: 4329,
  atk: 993,
  def: 0,
  emoji: '⚔️',
  imageId: '2765',
  critRate: 15,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, duration: 3, buffType: 'stat_enhance', target: 'self' },
      { type: 'dispel', value: 0, debuffClass: 'cc' },
    ],
  },
}
