import type { MercenaryTemplate } from '../../../types/mercenary'

export const ventana: MercenaryTemplate = {
  id: 'ventana',
  name: '벤타나',
  type: 'attacker',
  star: 5,
  maxHp: 4023,
  atk: 2733,
  def: 5,
  emoji: '⚔️',
  imageId: '2785',
  critRate: 75,
  critDamage: 75,
  agility: 45,
  skill: {
    timing: 'before_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
