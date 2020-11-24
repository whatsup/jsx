import { run } from '@fract/core'
import { Stream } from '@fract/core/dist/stream'
import { reconcile, placeElements, removeUnreconciledElements } from './mutator'
import { ReconcileMap } from './reconcile_map'
import { FractalJSX } from './types'

export function render(root: Stream<FractalJSX.Child>, container: HTMLElement | SVGElement = document.body) {
    return run(function* () {
        try {
            let oldReconcileMap = new ReconcileMap()

            while (true) {
                const result = yield* root
                const children = Array.isArray(result) ? result : [result]
                const elements = [] as (HTMLElement | SVGElement | Text)[]
                const reconcileMap = new ReconcileMap()

                reconcile(reconcileMap, elements, children, oldReconcileMap)
                removeUnreconciledElements(oldReconcileMap)
                placeElements(container, elements)

                oldReconcileMap = reconcileMap

                yield container
            }
        } catch (e) {
            console.error(e)
        }
    })
}
