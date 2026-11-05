"""Exercise discovery and safe creation in disposable, independent target projects."""
import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.dont_write_bytecode = True
SKILL = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('crm_bootstrap', SKILL / 'scripts/bootstrap_project.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class BootstrapTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.pc, self.h5 = self.root / 'new-pc', self.root / 'new-h5'
        self.pc.mkdir(); self.h5.mkdir()
        self.profile = json.loads((SKILL / 'templates/qv-profile.example.json').read_text(encoding='utf-8'))
        self.profile['targets']['pc']['files'] = {'page': 'packages/Example/src/index.vue'}
        self.profile['targets']['h5']['files'] = {'page': 'src/views/mine/index.vue'}
        self.source = self.pc / 'packages/Example/src/index.vue'
        self.source.parent.mkdir(parents=True)
        self.source.write_text('<template>original</template>', encoding='utf-8')
        self.config = self.root / 'profile.json'
        self.save()

    def save(self):
        self.config.write_text(json.dumps(self.profile, ensure_ascii=False), encoding='utf-8')

    def test_preview_does_not_write_and_exposes_missing_paths_and_unconfirmed_rules(self):
        report = module.bootstrap(self.config, self.pc, self.h5)
        self.assertFalse((self.pc / '.crm-adaptation').exists())
        self.assertEqual([r['status'] for r in report['files']], ['found', 'missing'])
        self.assertFalse(report['readyForImplementation'])
        self.assertTrue(report['warnings'])

    def test_apply_seeds_six_documents_and_preserves_existing_notes_and_business_source(self):
        report = module.bootstrap(self.config, self.pc, self.h5, True)
        self.assertEqual(len(report['written']), 6)
        self.assertEqual(self.source.read_text(), '<template>original</template>')
        plan = self.pc / '.crm-adaptation/implementation-plan.md'
        plan.write_text('user notes', encoding='utf-8')
        again = module.bootstrap(self.config, self.pc, self.h5, True)
        self.assertEqual(again['written'], [])
        self.assertEqual(len(again['preservedExisting']), 6)
        self.assertEqual(plan.read_text(), 'user notes')

    def test_without_h5_reports_not_provided_not_success(self):
        report = module.bootstrap(self.config, self.pc)
        self.assertEqual(report['files'][1]['status'], 'not-provided')
        self.assertFalse(report['readyForImplementation'])

    def test_h5_only_can_seed_the_mobile_project_without_a_fake_pc_root(self):
        report = module.bootstrap(self.config, h5_root=self.h5, apply=True)
        self.assertEqual(report['files'][0]['status'], 'not-provided')
        self.assertTrue((self.h5 / '.crm-adaptation/project-map.md').is_file())
        self.assertFalse((self.pc / '.crm-adaptation').exists())

    def test_mapping_and_output_cannot_escape_target(self):
        for value in ['../outside.vue', '/outside.vue', 'C:/outside.vue', 'src/../../outside.vue', '.git/config']:
            with self.subTest(mapping=value):
                self.profile['targets']['pc']['files']['page'] = value; self.save()
                with self.assertRaises(ValueError): module.bootstrap(self.config, self.pc, self.h5, True)
        self.profile['targets']['pc']['files']['page'] = 'packages/Example/src/index.vue'; self.save()
        with self.assertRaises(ValueError): module.bootstrap(self.config, self.pc, self.h5, True, '../outside')
        self.assertFalse((self.root / 'outside').exists())

    def test_only_confirmed_project_can_be_marked_ready(self):
        self.profile['targets'].pop('h5')
        self.profile['owners'] = {'dedup': 'example-owner'}
        self.profile['rules']['confirmedForTarget'] = True
        for operation in self.profile['operations'].values():
            operation['adapter'] = 'example-project-adapter'
            operation['confirmedForTarget'] = True
        self.save()
        self.assertTrue(module.bootstrap(self.config, self.pc)['readyForImplementation'])

    def test_mapped_but_unconfirmed_contract_is_not_ready(self):
        self.profile['targets'].pop('h5')
        self.profile['owners'] = {'dedup': 'example-owner'}
        self.profile['rules']['confirmedForTarget'] = True
        for operation in self.profile['operations'].values():
            operation['adapter'] = 'example-project-adapter'
        self.save()
        self.assertFalse(module.bootstrap(self.config, self.pc)['readyForImplementation'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
