# Mock KSO device (OSX Only)

This uses the FooHID driver to emulate a virtual KSO device for testing and development.

You will need to compile and install the `foohid` kext from source (as the latest release is somewhat out of date). Note that on Sierra, you will need to run `csrutil disable` from the recovery OS (restart, holding cmd+R) to run unsigned kexts.

First clone the foohid repo: <https://github.com/unbit/foohid>. Build the kext in xcode, and then manually install it.

    cp foohid.kext /Library/Extensions/foohid.kext
    cd /Library/Extensions
    sudo chmod -R 755 foohid.kext
    sudo chown -R root:wheel foohid.kext
    sudo kextload foohid.kext

Then build and run the client

    make
    ./kso
