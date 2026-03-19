import type { MercenaryTemplate } from '../../../types/mercenary'

export const ingrid: MercenaryTemplate = {
  id: 'ingrid',
  name: '잉그리드',
  type: 'attacker',
  star: 3,
  maxHp: 3009,
  atk: 954,
  def: 0,
  emoji: '⚔️',
  imageId: '1605',
  critRate: 20,
  critDamage: 25,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'atk_down', value: 65, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'agility_up', value: 50, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
