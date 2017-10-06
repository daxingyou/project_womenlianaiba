////////////////////////////////////////////////////////////////////////
// Author       : John Kolencheryl
// Description  : This is an event based Timer class similar to the
//                one found in Flash. Users can specify an interval
//                and the number of repetitions of that interval.
// Requirements : This script has to be attached to some GameObject
//                so that the Update() is called every frame.
// Uses         : timers, stopwatches, animations etc.
// Date         : 09/17/2010
////////////////////////////////////////////////////////////////////////

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class Timer
{
	private static List<Timer> timers = new List<Timer>();
	
    private int     _total_count = 0;				// number of intervals.
    private long    _current_count = 0;				// current interval count.
    private float   _interval = 0.0f;				// interval duration in seconds.
    private float   _start_time = 0.0f;				// start time for the current interval in seconds.
    private bool    _timer_running = false;			// status of the Timer.
	private object  _param;

    // Event which gets triggered on the completion of an interval.
    // timerObj - handle to the Timer object.
    // t        - handle to the Transform (of the GameObject of 
    //            which the Timer is a component).
    
	public delegate void TimerEventHandler(Timer timer, object obj);
    private TimerEventHandler[] handlers = new TimerEventHandler[2];
	
	public Timer(float interval, int count) 
    {
		_interval = interval / 1000;
        _total_count = count;
	}
	
	public Timer(float interval, int count, object param) 
    {
		_interval = interval / 1000;
        _total_count = count;
		_param = param;
	}
	
	// Update is called once per frame.
	public static void Update()
	{
//		foreach (Timer t in timers)
//		{
//			t.UpdateOneTimer();
//		}
		
		for (int i = 0; i < timers.Count;)
		{
			if (timers[i].UpdateOneTimer())
				++i;
		}
	}
	
	private bool UpdateOneTimer()
	{
		if (_timer_running)
		{
			if (Time.time - _start_time >= _interval && (_total_count > 0 ? _current_count < _total_count : true))
			{
				++_current_count;				// current interval count.
				TimerEventHandler hd = handlers[(int)TimerEvent.TIMER];
				if (null != hd)
				{
					hd(this, _param);
				}
				_start_time = Time.time;		// reset the start time.
			}
			else if (_total_count > 0 ? _current_count >= _total_count : false)
			{
				Stop();
				return false;
			}
			return true;
		}
		return true;
	}

    // This function starts the timer and changes
    // the state to running.
    // interval = interval duration in seconds.
    // count    = number of interval repetitions.
    // Note: 'count = 0' means infinite intervals.
    public void Start()
    {
		_timer_running = true;
		_start_time = Time.time;
		timers.Add(this);
    }

    // Stops the timer.
    public void Stop()
    {
        _timer_running = false;
		_current_count = 0;
		TimerEventHandler hd = handlers[(int)TimerEvent.TIMER_COMPLETE];
		if (null != hd)
		{
			hd(this, _param);
		}
		timers.Remove(this);
    }

	// Resets the timer to be used with
    // new interval and sound.
	public void Reset()
	{
		_interval = 0.0f;
		_total_count = 0;
		_current_count = 0;
		_timer_running = false;
	}

    // Get the current count.
    public long GetCurrentCount()
    {
        return _current_count;
    }

    // Get the total number of
    // interval repetitions.
    public int GetTotalCount()
    {
        return _total_count;
    }

    // Get status of the Timer.
    public bool IsRunning()
    {
        return _timer_running;
    }
	
	public void addEventListener(TimerEvent id, TimerEventHandler handler)
	{
		this.handlers[(int)id] = handler;
	}
	
	public void removeEventListener(TimerEvent id)
	{
		this.handlers[(int)id] = null;
	}
	
    // Removes the Timer object from the
    // GameObject's components.
//    public void Destroy()
//    {
//        Destroy(transform.GetComponent<Timer>());
//    }
}