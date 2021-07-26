
import {
    fieldLabel,
    input,
    select,
    slider,
} from '../field.js';

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('fieldLabel()', () => {
        describe('given a `label`', () => {
            it('should return an html button element string', () => {
                assert(fieldLabel('Widget')).isElementTag('label');
            });

            it('should contain the provided `label` content', () => {
                assert(fieldLabel('Widget')).stringIncludes('Widget');
            });
        });
    });

    describe('input()', () => {
        describe('given a `name`', () => {
            let inputHtml = input('widget');

            it('should return an html input element string', () => {
                assert(inputHtml).isElementTag('input');
            });

            it('should contain the correct `name` attribute', () => {
                assert(inputHtml).stringIncludes('name="widget"');
            });

            it('should contain the `type="text"` attribute by default', () => {
                assert(inputHtml).stringIncludes('type="text"');
            });
        });

        describe('given a `type`', () => {
            it('should contain a `type` attribute with the given type', () => {
                assert(input('widget', { type: 'number' })).stringIncludes('type="number"');
            });
        });

        describe('given a `value`', () => {
            it('should contain a `value` attribute with the given value', () => {
                assert(input('widget', { value: 15 })).stringIncludes('value="15"');
            });
        });

        describe('given an undefined attribute', () => {
            it('should not add that attribute to the html input element', () => {
                assert(input('widget', { action: undefined })).stringExcludes('action');
            });
        });

        describe('given a `name` attribute', () => {
            it('should throw', () => {
                assert(() => input('widget', { name: 'not-widget' }))
                    .throws('Input `attrs` cannot contain a name');
            });
        });
    });

    describe('select()', () => {
        describe('given a `name`', () => {
            let selectHtml = select('widget', []);

            it('should return an html select element string', () => {
                assert(selectHtml).isElementTag('select');
            });

            it('should contain the correct `name` attribute', () => {
                assert(selectHtml).stringIncludes('name="widget"');
            });
        });

        describe('given 3 select options', () => {
            it('should return an html select element string three options', () => {
                let result = select('widget', [ 'a', 'two', 'pi' ]);
                let expect = '<select name="widget"><option value="a">a</option><option value="two">two</option><option value="pi">pi</option></select>';
                assert(result).equals(expect);
            });
        });

        describe('given a camelCase option', () => {
            it('should convert the camelCase option to words on the option label', () => {
                let result = select('widget', [ 'bloodthirstyBarbarians' ]);
                let expect = '<select name="widget"><option value="bloodthirstyBarbarians">bloodthirsty barbarians</option></select>';
                assert(result).equals(expect);
            });
        });
    });

    describe('slider()', () => {
        describe('given a `name`', () => {
            it('should return a string', () => {
                assert(slider('widget')).isString();
            });

            it('should return an html input element string with the given `name` attribute and `type="range"`, `min="1"`, and `max="100"` attributes by default', () => {
                assert(slider('widget')).equals('<input name="widget" type="range" min="1" max="100" />');
            });
        });

        describe('given a `value`', () => {
            it('should include a `value` attribute with the given value', () => {
                assert(slider('widget', { value: 15 })).stringIncludes('value="15"');
            });
        });

        describe('given a `min`', () => {
            it('should include a `min` attribute with the given value', () => {
                assert(slider('widget', { min: 32 })).stringIncludes('min="32"');
            });
        });

        describe('given a `max`', () => {
            it('should include a `max` attribute with the given value', () => {
                assert(slider('widget', { max: 23 })).stringIncludes('max="23"');
            });
        });

        describe('given a `type` attribute', () => {
            it('should throw', () => {
                assert(() => slider('widget', { type: 'text' }))
                    .throws('Slider `attrs` cannot contain a type');
            });
        });

        describe('given a `min` that is not a number', () => {
            it('should throw', () => {
                assert(() => slider('widget', { min: '1' }))
                    .throws('Slider `min` must be a number');
            });
        });

        describe('given a `max` that is not a number', () => {
            it('should throw', () => {
                assert(() => slider('widget', { max: '1' }))
                    .throws('Slider `max` must be a number');
            });
        });

        describe('given a `min` the same as `max`', () => {
            it('should throw', () => {
                assert(() => slider('widget', { min: 1, max: 1 }))
                    .throws('Slider `min` must be less than `max`');
            });
        });

        describe('given a `min` greater than `max`', () => {
            it('should throw', () => {
                assert(() => slider('widget', { min: 126, max: 12 }))
                    .throws('Slider `min` must be less than `max`');
            });
        });
    });
};
