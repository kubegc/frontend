<template>
  <div class="app-detail-container">
    <el-row class="top-row">
      <el-col>
        Tomcat
          <a href="http://39.106.40.190:5002/?image=tomcat">
            <el-button icon="el-icon-share" circle>
            </el-button>
          </a>

      </el-col>
    </el-row>
    <el-divider/>
    <el-row>

      <el-form label-position="top">
        <el-form-item label="architecture">
          <span>{{ imageJson.metadata.architecture }}</span>
          <el-divider/>
        </el-form-item>

        <el-form-item label="os">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card shadow="never">
                <p v-for="(val, key) in imageJson.os">
                  {{ key + ': ' + val }}
                </p>
              </el-card>
              <el-divider/>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="application">
          <el-row :gutter="20">
            <el-col :span="6" v-for="(item, index) in imageJson.application" :key="index">
              <el-card shadow="never">
                    <p class="p-style" v-for="(val, key) in item">{{ key + ':' + val }}</p>
              </el-card>
              <el-divider/>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="image">
          <span>{{ imageJson.metadata.config.Image }}</span>
          <el-divider/>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageJson: {
        'metadata': {
          'architecture': 'amd64',
          'config': {
            'Hostname': '',
            'Domainname': '',
            'User': '',
            'AttachStdin': false,
            'AttachStdout': false,
            'AttachStderr': false,
            'Tty': false,
            'OpenStdin': false,
            'StdinOnce': false,
            'Env': ['PATH=/usr/local/openjdk-11/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'LANG=C.UTF-8', 'JAVA_HOME=/usr/local/openjdk-11', 'JAVA_VERSION=11.0.7', 'JAVA_BASE_URL=https://github.com/AdoptOpenJDK/openjdk11-upstream-binaries/releases/download/jdk-11.0.7%2B10/OpenJDK11U-jdk_', 'JAVA_URL_VERSION=11.0.7_10'],
            'Cmd': ['jshell'],
            'ArgsEscaped': true,
            'Image': 'sha256:fb2c9c84b1135441f43d7f22ec0be4c5809b93a2b18b3c9971a658d8c122a4b7',
            'Volumes': null,
            'WorkingDir': '/home/kubernetes-api-mapper',
            'Entrypoint': null,
            'OnBuild': null,
            'Labels': null
          },
          'container': 'a248a631cff3f2e4a7c7d0a6a9e924b30a12647860af3f9502bcb697fe766be8',
          'container_config': {
            'Hostname': 'a248a631cff3',
            'Domainname': '',
            'User': '',
            'AttachStdin': false,
            'AttachStdout': false,
            'AttachStderr': false,
            'Tty': false,
            'OpenStdin': false,
            'StdinOnce': false,
            'Env': ['PATH=/usr/local/openjdk-11/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'LANG=C.UTF-8', 'JAVA_HOME=/usr/local/openjdk-11', 'JAVA_VERSION=11.0.7', 'JAVA_BASE_URL=https://github.com/AdoptOpenJDK/openjdk11-upstream-binaries/releases/download/jdk-11.0.7%2B10/OpenJDK11U-jdk_', 'JAVA_URL_VERSION=11.0.7_10'],
            'Cmd': ['/bin/sh', '-c', '#(nop) WORKDIR /home/kubernetes-api-mapper'],
            'ArgsEscaped': true,
            'Image': 'sha256:fb2c9c84b1135441f43d7f22ec0be4c5809b93a2b18b3c9971a658d8c122a4b7',
            'Volumes': null,
            'WorkingDir': '/home/kubernetes-api-mapper',
            'Entrypoint': null,
            'OnBuild': null,
            'Labels': {}
          },
          'created': '2020-10-16T00:52:02.255636377Z',
          'docker_version': '19.03.12',
          'history': [{
            'created': '2020-06-09T01:20:56.175917193Z',
            'created_by': '/bin/sh -c #(nop) ADD file:4d35f6c8bbbe6801cc5f44989730fb6d349a644ecb36eca481e7df25842d6321 in / '
          }, {
            'created': '2020-06-09T01:20:56.423338297Z',
            'created_by': '/bin/sh -c #(nop)  CMD ["bash"]',
            'empty_layer': true
          }, {
            'created': '2020-06-09T16:34:36.800891655Z',
            'created_by': '/bin/sh -c set -eux; \tapt-get update; \tapt-get install -y --no-install-recommends \t\tca-certificates p11-kit \t; \trm -rf /var/lib/apt/lists/*'
          }, {
            'created': '2020-06-09T16:34:37.024709089Z',
            'created_by': '/bin/sh -c #(nop)  ENV LANG=C.UTF-8',
            'empty_layer': true
          }, {
            'created': '2020-06-09T16:37:19.119548081Z',
            'created_by': '/bin/sh -c #(nop)  ENV JAVA_HOME=/usr/local/openjdk-11',
            'empty_layer': true
          }, {
            'created': '2020-06-09T16:37:19.347128454Z',
            'created_by': '/bin/sh -c #(nop)  ENV PATH=/usr/local/openjdk-11/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
            'empty_layer': true
          }, {
            'created': '2020-06-09T16:37:20.19604481Z',
            'created_by': '/bin/sh -c { echo \'#/bin/sh\'; echo \'echo "$JAVA_HOME"\'; } > /usr/local/bin/docker-java-home && chmod +x /usr/local/bin/docker-java-home && [ "$JAVA_HOME" = "$(docker-java-home)" ]'
          }, {
            'created': '2020-06-09T16:37:20.387852125Z',
            'created_by': '/bin/sh -c #(nop)  ENV JAVA_VERSION=11.0.7',
            'empty_layer': true
          }, {
            'created': '2020-06-09T16:37:20.562969063Z',
            'created_by': '/bin/sh -c #(nop)  ENV JAVA_BASE_URL=https://github.com/AdoptOpenJDK/openjdk11-upstream-binaries/releases/download/jdk-11.0.7%2B10/OpenJDK11U-jdk_',
            'empty_layer': true
          }, {
            'created': '2020-06-09T16:37:20.759696207Z',
            'created_by': '/bin/sh -c #(nop)  ENV JAVA_URL_VERSION=11.0.7_10',
            'empty_layer': true
          }, {
            'created': '2020-06-09T16:37:42.083335204Z',
            'created_by': '/bin/sh -c set -eux; \t\tdpkgArch="$(dpkg --print-architecture)"; \tcase "$dpkgArch" in \t\tamd64) upstreamArch=\'x64\' ;; \t\tarm64) upstreamArch=\'aarch64\' ;; \t\t*) echo >&2 "error: unsupported architecture: $dpkgArch" ;; \tesac; \t\tsavedAptMark="$(apt-mark showmanual)"; \tapt-get update; \tapt-get install -y --no-install-recommends \t\tdirmngr \t\tgnupg \t\twget \t; \trm -rf /var/lib/apt/lists/*; \t\twget -O openjdk.tgz.asc "${JAVA_BASE_URL}${upstreamArch}_linux_${JAVA_URL_VERSION}.tar.gz.sign"; \twget -O openjdk.tgz "${JAVA_BASE_URL}${upstreamArch}_linux_${JAVA_URL_VERSION}.tar.gz" --progress=dot:giga; \t\texport GNUPGHOME="$(mktemp -d)"; \tgpg --batch --keyserver ha.pool.sks-keyservers.net --keyserver-options no-self-sigs-only --recv-keys CA5F11C6CE22644D42C6AC4492EF8D39DC13168F; \tgpg --batch --keyserver ha.pool.sks-keyservers.net --recv-keys EAC843EBD3EFDB98CC772FADA5CD6035332FA671; \tgpg --batch --list-sigs --keyid-format 0xLONG CA5F11C6CE22644D42C6AC4492EF8D39DC13168F \t\t| tee /dev/stderr \t\t| grep \'0xA5CD6035332FA671\' \t\t| grep \'Andrew Haley\'; \tgpg --batch --verify openjdk.tgz.asc openjdk.tgz; \tgpgconf --kill all; \trm -rf "$GNUPGHOME"; \t\tmkdir -p "$JAVA_HOME"; \ttar --extract \t\t--file openjdk.tgz \t\t--directory "$JAVA_HOME" \t\t--strip-components 1 \t\t--no-same-owner \t; \trm openjdk.tgz*; \t\t\tapt-mark auto \'.*\' > /dev/null; \t[ -z "$savedAptMark" ] || apt-mark manual $savedAptMark > /dev/null; \tapt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \t\t{ \t\techo \'#!/usr/bin/env bash\'; \t\techo \'set -Eeuo pipefail\'; \t\techo \'if ! [ -d "$JAVA_HOME" ]; then echo >&2 "error: missing JAVA_HOME environment variable"; exit 1; fi\'; \t\techo \'cacertsFile=; for f in "$JAVA_HOME/lib/security/cacerts" "$JAVA_HOME/jre/lib/security/cacerts"; do if [ -e "$f" ]; then cacertsFile="$f"; break; fi; done\'; \t\techo \'if [ -z "$cacertsFile" ] || ! [ -f "$cacertsFile" ]; then echo >&2 "error: failed to find cacerts file in $JAVA_HOME"; exit 1; fi\'; \t\techo \'trust extract --overwrite --format=java-cacerts --filter=ca-anchors --purpose=server-auth "$cacertsFile"\'; \t} > /etc/ca-certificates/update.d/docker-openjdk; \tchmod +x /etc/ca-certificates/update.d/docker-openjdk; \t/etc/ca-certificates/update.d/docker-openjdk; \t\tfind "$JAVA_HOME/lib" -name \'*.so\' -exec dirname \'{}\' \';\' | sort -u > /etc/ld.so.conf.d/docker-openjdk.conf; \tldconfig; \t\tjavac --version; \tjava --version'
          }, {
            'created': '2020-06-09T16:37:45.131068536Z',
            'created_by': '/bin/sh -c #(nop)  CMD ["jshell"]',
            'empty_layer': true
          }, {
            'created': '2020-10-08T10:01:36.250510173Z',
            'created_by': '/bin/sh -c mkdir -p /home/kubernetes-api-mapper'
          }, {
            'created': '2020-10-16T00:52:02.087961832Z',
            'created_by': '/bin/sh -c #(nop) ADD file:128791c20325af1af31b677528a8a55d6260cc007989f834051f204bad06c6ae in /home/kubernetes-api-mapper/ '
          }, {
            'created': '2020-10-16T00:52:02.255636377Z',
            'created_by': '/bin/sh -c #(nop) WORKDIR /home/kubernetes-api-mapper',
            'empty_layer': true
          }],
          'os': 'linux',
          'rootfs': {
            'type': 'layers',
            'diff_ids': ['sha256:13cb14c2acd34e45446a50af25cb05095a17624678dbafbcc9e26086547c1d74', 'sha256:94cf29cec5e1e69ddeef0d0e43648b0185e0931920a0b37eda718a5ebe25fa46', 'sha256:9fc268fda51763b2c26c12dd6d384ff8c9e2910cfa3f91df4503b24d90e6435e', 'sha256:0be2a376433ac6f99c2b1996c6bcb60e91b904deb23b8f1b4c0714150068c98b', 'sha256:e45fdc343d04c6630a0eb6eccfd6a3739b267507b0d0d91c04eb298b9f59aa8f', 'sha256:8078b55dde9178e337f62cc5c01f0bf75001a154069a1217d46fb7c391e2c63f']
          }
        },
        'os': {
          'name': 'debian',
          'version': '10',
          'url': 'https://www.debian.org/'
        },
        'system': {
          'addpart': 'addpart',
          'apt': 'apt',
          'apt-cache': 'apt-cache',
          'apt-cdrom': 'apt-cdrom',
          'apt-config': 'apt-config',
          'apt-get': 'apt-get',
          'apt-key': 'apt-key',
          'apt-mark': 'apt-mark',
          'arch': 'arch',
          'awk': 'awk',
          'b2sum': 'b2sum',
          'base32': 'base32',
          'base64': 'base64',
          'basename': 'basename',
          'bashbug': 'bashbug',
          'captoinfo': 'captoinfo',
          'catchsegv': 'catchsegv',
          'chage': 'chage',
          'chattr': 'chattr',
          'chcon': 'chcon',
          'chfn': 'chfn',
          'choom': 'choom',
          'chrt': 'chrt',
          'chsh': 'chsh',
          'cksum': 'cksum',
          'clear': 'clear',
          'clear_console': 'clear_console',
          'cmp': 'cmp',
          'comm': 'comm',
          'csplit': 'csplit',
          'cut': 'cut',
          'deb-systemd-helper': 'deb-systemd-helper',
          'deb-systemd-invoke': 'deb-systemd-invoke',
          'debconf': 'debconf',
          'debconf-apt-progress': 'debconf-apt-progress',
          'debconf-communicate': 'debconf-communicate',
          'debconf-copydb': 'debconf-copydb',
          'debconf-escape': 'debconf-escape',
          'debconf-set-selections': 'debconf-set-selections',
          'debconf-show': 'debconf-show',
          'delpart': 'delpart',
          'diff': 'diff',
          'diff3': 'diff3',
          'dircolors': 'dircolors',
          'dirname': 'dirname',
          'dpkg': 'dpkg',
          'dpkg-deb': 'dpkg-deb',
          'dpkg-divert': 'dpkg-divert',
          'dpkg-maintscript-helper': 'dpkg-maintscript-helper',
          'dpkg-query': 'dpkg-query',
          'dpkg-split': 'dpkg-split',
          'dpkg-statoverride': 'dpkg-statoverride',
          'dpkg-trigger': 'dpkg-trigger',
          'du': 'du',
          'env': 'env',
          'expand': 'expand',
          'expiry': 'expiry',
          'expr': 'expr',
          'factor': 'factor',
          'faillog': 'faillog',
          'fallocate': 'fallocate',
          'fincore': 'fincore',
          'find': 'find',
          'flock': 'flock',
          'fmt': 'fmt',
          'fold': 'fold',
          'getconf': 'getconf',
          'getent': 'getent',
          'getopt': 'getopt',
          'gpasswd': 'gpasswd',
          'gpgv': 'gpgv',
          'groups': 'groups',
          'head': 'head',
          'hostid': 'hostid',
          'i386': 'i386',
          'iconv': 'iconv',
          'id': 'id',
          'infocmp': 'infocmp',
          'infotocap': 'infotocap',
          'install': 'install',
          'ionice': 'ionice',
          'ipcmk': 'ipcmk',
          'ipcrm': 'ipcrm',
          'ipcs': 'ipcs',
          'ischroot': 'ischroot',
          'join': 'join',
          'last': 'last',
          'lastb': 'lastb',
          'lastlog': 'lastlog',
          'ldd': 'ldd',
          'link': 'link',
          'linux32': 'linux32',
          'linux64': 'linux64',
          'locale': 'locale',
          'localedef': 'localedef',
          'logger': 'logger',
          'logname': 'logname',
          'lsattr': 'lsattr',
          'lscpu': 'lscpu',
          'lsipc': 'lsipc',
          'lslocks': 'lslocks',
          'lslogins': 'lslogins',
          'lsmem': 'lsmem',
          'lsns': 'lsns',
          'mawk': 'mawk',
          'mcookie': 'mcookie',
          'md5sum': 'md5sum',
          'md5sum.textutils': 'md5sum.textutils',
          'mesg': 'mesg',
          'mkfifo': 'mkfifo',
          'namei': 'namei',
          'nawk': 'nawk',
          'newgrp': 'newgrp',
          'nice': 'nice',
          'nl': 'nl',
          'nohup': 'nohup',
          'nproc': 'nproc',
          'nsenter': 'nsenter',
          'numfmt': 'numfmt',
          'od': 'od',
          'pager': 'pager',
          'partx': 'partx',
          'passwd': 'passwd',
          'paste': 'paste',
          'pathchk': 'pathchk',
          'perl': 'perl',
          'perl5.28.1': 'perl5.28.1',
          'pinky': 'pinky',
          'pldd': 'pldd',
          'pr': 'pr',
          'printenv': 'printenv',
          'printf': 'printf',
          'prlimit': 'prlimit',
          'ptx': 'ptx',
          'realpath': 'realpath',
          'rename.ul': 'rename.ul',
          'renice': 'renice',
          'reset': 'reset',
          'resizepart': 'resizepart',
          'rev': 'rev',
          'rgrep': 'rgrep',
          'runcon': 'runcon',
          'savelog': 'savelog',
          'script': 'script',
          'scriptreplay': 'scriptreplay',
          'sdiff': 'sdiff',
          'seq': 'seq',
          'setarch': 'setarch',
          'setpriv': 'setpriv',
          'setsid': 'setsid',
          'setterm': 'setterm',
          'sg': 'sg',
          'sha1sum': 'sha1sum',
          'sha224sum': 'sha224sum',
          'sha256sum': 'sha256sum',
          'sha384sum': 'sha384sum',
          'sha512sum': 'sha512sum',
          'shred': 'shred',
          'shuf': 'shuf',
          'sort': 'sort',
          'split': 'split',
          'stat': 'stat',
          'stdbuf': 'stdbuf',
          'sum': 'sum',
          'tabs': 'tabs',
          'tac': 'tac',
          'tail': 'tail',
          'taskset': 'taskset',
          'tee': 'tee',
          'test': 'test',
          'tic': 'tic',
          'timeout': 'timeout',
          'toe': 'toe',
          'touch': 'touch',
          'tput': 'tput',
          'tr': 'tr',
          'truncate': 'truncate',
          'tset': 'tset',
          'tsort': 'tsort',
          'tty': 'tty',
          'tzselect': 'tzselect',
          'unexpand': 'unexpand',
          'uniq': 'uniq',
          'unlink': 'unlink',
          'unshare': 'unshare',
          'update-alternatives': 'update-alternatives',
          'users': 'users',
          'utmpdump': 'utmpdump',
          'wall': 'wall',
          'wc': 'wc',
          'whereis': 'whereis',
          'which': 'which',
          'who': 'who',
          'whoami': 'whoami',
          'x86_64': 'x86_64',
          'xargs': 'xargs',
          'yes': 'yes',
          'zdump': 'zdump',
          '[': '[',
          'add-shell': 'add-shell',
          'addgroup': 'addgroup',
          'adduser': 'adduser',
          'chgpasswd': 'chgpasswd',
          'chmem': 'chmem',
          'chpasswd': 'chpasswd',
          'chroot': 'chroot',
          'cpgr': 'cpgr',
          'cppw': 'cppw',
          'delgroup': 'delgroup',
          'deluser': 'deluser',
          'dpkg-preconfigure': 'dpkg-preconfigure',
          'dpkg-reconfigure': 'dpkg-reconfigure',
          'e2freefrag': 'e2freefrag',
          'e4crypt': 'e4crypt',
          'e4defrag': 'e4defrag',
          'fdformat': 'fdformat',
          'filefrag': 'filefrag',
          'groupadd': 'groupadd',
          'groupdel': 'groupdel',
          'groupmems': 'groupmems',
          'groupmod': 'groupmod',
          'grpck': 'grpck',
          'grpconv': 'grpconv',
          'grpunconv': 'grpunconv',
          'iconvconfig': 'iconvconfig',
          'invoke-rc.d': 'invoke-rc.d',
          'ldattach': 'ldattach',
          'mklost+found': 'mklost+found',
          'newusers': 'newusers',
          'nologin': 'nologin',
          'pam-auth-update': 'pam-auth-update',
          'pam_getenv': 'pam_getenv',
          'pam_timestamp_check': 'pam_timestamp_check',
          'policy-rc.d': 'policy-rc.d',
          'pwck': 'pwck',
          'pwconv': 'pwconv',
          'pwunconv': 'pwunconv',
          'readprofile': 'readprofile',
          'remove-shell': 'remove-shell',
          'rmt': 'rmt',
          'rmt-tar': 'rmt-tar',
          'rtcwake': 'rtcwake',
          'service': 'service',
          'tarcat': 'tarcat',
          'tzconfig': 'tzconfig',
          'update-passwd': 'update-passwd',
          'update-rc.d': 'update-rc.d',
          'useradd': 'useradd',
          'userdel': 'userdel',
          'usermod': 'usermod',
          'vigr': 'vigr',
          'vipw': 'vipw',
          'zic': 'zic'
        },
        'application': [{
          'groupId': 'aa',
          'artifactId': 'bbb',
          'version': '11111111111111111111111111111111111111111111111111'
        },
          {
            'groupId': 'aa',
            'artifactId': 'bbb',
            'version': '111'
          },
          {
            'groupId': 'aa',
            'artifactId': 'bbb',
            'version': '111'
          },
          {
            'groupId': 'aa',
            'artifactId': 'bbb',
            'version': '111'
          },
          {
            'groupId': 'aa',
            'artifactId': 'bbb',
            'version': '111'
          },
          {
            'groupId': 'aa',
            'artifactId': 'bbb',
            'version': '111'
          },
          {
            'groupId': 'aa',
            'artifactId': 'bbb',
            'version': '111'
          },
          {
            'groupId': 'aa',
            'artifactId': 'bbb',
            'version': '111'
          },
          {
            'groupId': 'aa',
            'artifactId': 'bbb',
            'version': '111'
          }]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-detail-container {
  padding: 10px 20px;
  .top-row{
    margin-bottom: 30px;
    font-size: 50px;
  }
  .p-style{
    overflow: hidden;
  }
  .el-row {
    .el-form {
      margin-left: 20px;

      ::v-deep {
        label {
          font-size: 20px;
        }
      }

      .el-form-item {
        p, span{
          font-size: 16px;
        }

        .el-col:nth-child(n + 5){
          margin-top: 30px;
        }
      }
    }
  }

}

</style>
