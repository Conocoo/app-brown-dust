import type { MercenaryTemplate } from '../../../types/mercenary'

export const janki: MercenaryTemplate = {
  id: 'janki',
  name: '잔기',
  type: 'attacker',
  star: 5,
  maxHp: 4352,
  atk: 1243,
  def: 5,
  emoji: '⚔️',
  imageId: '1595',
  critRate: 10,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
