// @ts-check

import {
    // Private Functions
    testFormatKnobAccordions as formatKnobAccordions,
    testGetFields            as getFields,
    testGetKnob              as getKnob,

    // Public Functions
    getFormData,
    getKnobPanel,
} from '../form.js';

/** @typedef {import('../../controller/knobs.js').KnobFieldConfig} KnobFieldConfig */

/** @type {KnobFieldConfig} */
const fakeKnob = {
    label: 'Tools',
    name: 'dungeonComplexity',
    desc: 'How complex should it be?',
    type: 'range',
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('formatKnobAccordions()', () => {
        describe('given an empty array', () => {
            it('returns an empty string', () => {
                assert(formatKnobAccordions([])).equals('');
            });
        });

        describe('given a knob config', () => {
            const result = formatKnobAccordions([ { label: 'Shovels', fields: [] } ]);

            it('returns an html fieldset element string', () => {
                assert(/<fieldset(.*?)>(.*?)<\/fieldset>/.test(result)).isTrue();
            });

            it('contains the correct data-id', () => {
                assert(result).stringIncludes('data-id="fieldset-shovels"');
            });

            it('includes an html accordion button', () => {
                const snapshot = '<button data-action="accordion" data-size="small" data-target="fieldset-shovels" ' +
                    'type="button">Shovels</button>';

                assert(result).stringIncludes(snapshot);
            });

            it('does not collapse the first section', () => {
                assert(result).stringIncludes('data-collapsed="false"');
            });
        });

        describe('given an array of fields', () => {
            /** @type {KnobFieldConfig[]} */
            const fields = [
                { name: 'roomSize',     label: 'Room Size',     desc: 'Room Size?',     type: 'number' },
                { name: 'itemQuantity', label: 'Item Quantity', desc: 'Item Quantity?', type: 'range' },
                { name: 'dungeonTraps', label: 'Traps',         desc: 'Traps?',         type: 'select', values: [ '1' ] },
            ];

            const result = formatKnobAccordions([ { label: 'Shovels', fields } ]);

            it('includes an HTML input string and label for each knob setting', () => {
                assert(result)
                    .stringIncludes('Room Size')
                    .stringIncludes('<input name="roomSize" type="number" />')
                    .stringIncludes('Item Quantity')
                    .stringIncludes('<input name="itemQuantity" type="range" />')
                    .stringIncludes('Traps')
                    .stringIncludes('<select name="dungeonTraps"><option value="1">1</option></select>');
            });
        });

        describe('given multiple knob configs', () => {
            it('should collapsed all sections except the first', () => {
                const result = formatKnobAccordions([
                    { label: 'Shovels', fields: [] },
                    { label: 'Gardening Tools', fields: [] },
                    { label: 'Weed Whackers', fields: [] },
                ]);

                assert(result)
                    .stringIncludes('<fieldset data-collapsed="false" data-id="fieldset-shovels">')
                    .stringIncludes('<fieldset data-collapsed="true" data-id="fieldset-gardening-tools">')
                    .stringIncludes('<fieldset data-collapsed="true" data-id="fieldset-weed-whackers">');
            });
        });
    });

    describe('getFields()', () => {
        describe('given an empty array', () => {
            it('should return an empty string', () => {
                assert(getFields([])).equals('');
            });
        });

        describe('given a knob with no name', () => {
            it('should throw', () => {
                const knob = { ...fakeKnob };
                delete knob.name;

                assert(() => getFields([ knob ]))
                    .throws('Missing required knob name');
            });
        });

        describe('given a knob with no label', () => {
            it('should throw', () => {
                const knob = { ...fakeKnob };
                delete knob.label;

                assert(() => getFields([ knob ]))
                    .throws('Missing required knob label');
            });
        });

        describe('given a knob with no description', () => {
            it('should throw', () => {
                const knob = { ...fakeKnob };
                delete knob.desc;

                assert(() => getFields([ knob ]))
                    .throws('Missing required knob description');
            });
        });


        describe('given settings for a single knob', () => {
            const knob = { name: 'size', label: 'Size', desc: 'Pi', type: 'number' };

            describe('given a name, label, and type', () => {
                const result = getFields([ knob ]);

                it('should return a string', () => {
                    assert(result).isString();
                });

                it('should include an html input string', () => {
                    assert(result).stringIncludes('<input name="size" type="number" />');
                });

                it('should include an html label string', () => {
                    assert(/<label>Size(.*?)<\/label>/.test(result)).isTrue();
                });
            });

            describe('given a description', () => {
                const result = getFields([ { ...knob, desc: 'Toad\'s tenacity'} ]);

                it('should include an html info button string', () => {
                    const snapshot = '<button data-action="toggle" data-size="auto" data-target="info-size" ' +
                        'data-info="true" type="button">?</button>';

                    assert(result).stringIncludes(snapshot);
                });

                it('should include an hidden html info paragraph string', () => {
                    const snapshot = '<p hidden="true" data-id="info-size"><small>Toad\'s tenacity</small></p>';
                    assert(result).stringIncludes(snapshot);
                });
            });
        });

        describe('given settings for multiple knobs', () => {
            const result = getFields([
                { name: 'size',        label: 'Size',        desc: 'Size?',        type: 'number' },
                { name: 'shape',       label: 'Shape',       desc: 'Shape?',       type: 'range' },
                { name: 'squishiness', label: 'Squishiness', desc: 'Squishiness?', type: 'select', values: [ '1' ] },
            ]);

            it('should include an html input string for each knob setting', () => {
                assert(result)
                    .stringIncludes('<input name="size" type="number" />')
                    .stringIncludes('<input name="shape" type="range" />')
                    .stringIncludes('<select name="squishiness"><option value="1">1</option></select>');
            });

            it('should include an HTML label string for each knob setting', () => {
                assert(/<label>Size(.*?)<\/label>/.test(result)).isTrue();
                assert(/<label>Shape(.*?)<\/label>/.test(result)).isTrue();
                assert(/<label>Squishiness(.*?)<\/label>/.test(result)).isTrue();
            });
        });
    });

    describe('getKnob()', () => {
        describe('given an invalid type', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getKnob({ ...fakeKnob, type: 'junk' }))
                    .throws('Invalid knob type');
            });
        });

        describe('given a type of "select"', () => {
            it('should return an html select element string with the given values as options', () => {
                const knob = getKnob({ ...fakeKnob, type: 'select', values: [ 'toast' ] });
                assert(/<select(.*?)><option(.+?)value="toast"(.*?)>toast<\/option><\/select>/.test(knob)).isTrue();
            });

            describe('given a value that is not a string', () => {
                it('throws', () => {
                    assert(() => getKnob({ ...fakeKnob, type: 'junk' }))
                        .throws('Invalid knob type');
                });
            });
        });

        describe('given a type of "number"', () => {
            it('should return an html input element string', () => {
                assert(getKnob({ ...fakeKnob, type: 'number' })).isElementTag('input');
            });
        });

        describe('given a type of "range"', () => {
            it('should return an html input element string', () => {
                assert(getKnob({ ...fakeKnob, type: 'range' })).isElementTag('input');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getFormData()', () => {
        describe('given an element with knob child elements', () => {
            const container = document.createElement('div');

            const addKnob = (tag, name, value) => {
                const knob = document.createElement(tag);

                knob.name  = name;
                knob.value = value;

                if (tag === 'select') {
                    knob.innerHTML = `<option value="${value}">${value}</option>`;
                }

                container.appendChild(knob);
            };

            addKnob('input', 'gopher', 'ralph');
            addKnob('select', 'lion', 'bob');
            addKnob('input', 'hats', 12);

            const results = getFormData(container);

            it('should return an object', () => {
                assert(results).isObject();
            });

            it('should return an object of knob values keyed by knob name', () => {
                assert(results.gopher).equals('ralph');
                assert(results.lion).equals('bob');
                assert(results.hats).equals('12');
            });
        });
    });

    // TODO tests for `config` & `isExpanded` options
    describe('getKnobPanel()', () => {
        let knobs = getKnobPanel('dungeon');

        it('should return a string', () => {
            assert(knobs).isString();
        });

        it('should include a submit button', () => {
            assert(knobs).stringIncludes(
                `<button data-action="generate" data-size="large" type="submit">Generate</button>`
            );
        });

        it('should include three fieldsets for the `dungeon` panel', () => {
            assert(knobs.match(/<fieldset(.*?)>(.*?)<\/fieldset>/g).length).equals(3);
        });

        describe('give the `items` page', () => {
            it('should return the field sets for the `items` page', () => {
                let itemKnobs = getKnobPanel('items');
                assert(itemKnobs.match(/<fieldset(.*?)>(.*?)<\/fieldset>/g).length).equals(1);
            });
        });
    });
};
