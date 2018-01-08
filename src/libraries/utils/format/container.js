import _map from 'lodash/map';
import formatMemoryLimit from './memoryLimit';
import formatCPUs from './cpus';

export default function container(ct, hostMemory) {
  let cpus = ct.attributes.lxc.cgroup.cpuset.cpus;
  cpus = cpus.length > 0 ? cpus[0] : null;

  const memoryLimit = ct.attributes.lxc.cgroup.memory.limit_in_bytes;
  const swapLimit = ct.attributes.lxc.cgroup.memory.memsw.limit_in_bytes;
  const state = ct.attributes.state;

  return {
    state,
    name: ct.attributes.name,
    utsname: ct.attributes.lxc.utsname,
    cpus: {
      raw: cpus,
      formatted: formatCPUs(cpus)
    },
    ips: ct.attributes.ips,
    network: _map(ct.attributes.lxc.network, net => ({
      flags: net.flags,
      hwaddr: net.hwaddr,
      ipv4: net.ipv4._,
      ipv6: net.ipv6._,
      type: net.type,
      link: net.link
    })),
    rootfs: ct.attributes.lxc.rootfs._,
    memory: {
      limit: {
        raw: memoryLimit || null,
        formatted: formatMemoryLimit(memoryLimit, hostMemory) || null
      },
      swap: {
        raw: swapLimit || null,
        formatted: formatMemoryLimit(swapLimit, hostMemory) || null
      }
    },
    groups: _map(ct.attributes.lxc.group, group => group)
  };
}
