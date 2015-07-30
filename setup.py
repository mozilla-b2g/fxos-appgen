# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at http://mozilla.org/MPL/2.0/.

from setuptools import setup
from setuptools import find_packages

PACKAGE_VERSION = '0.14'
deps = ['marionette_client>=0.16',
        'mozdevice >= 0.33']

setup(name='fxos_appgen',
      version=PACKAGE_VERSION,
      description="Generates and installs FxOS apps",
      classifiers=[],
      keywords='mozilla',
      author='Mozilla Automation and Testing Team',
      author_email='tools@lists.mozilla.org',
      url='https://github.com/mozilla-b2g/fxos-certsuite',
      license='MPL',
      packages=['fxos_appgen'],
      include_package_data=True,
      zip_safe=False,
      install_requires=deps,
      entry_points="""
      # -*- Entry points: -*-
      [console_scripts]
      fxos_appgen = fxos_appgen.generator:cli
      """)
